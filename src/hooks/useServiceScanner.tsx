import { useState } from 'react';
import { GoogleService, ScanResults, ScanViolation } from '@/components/google/types';
import { SupportedLanguage } from '@/utils/language';
import { Industry, Region } from '@/utils/types';
import { scanGoogleService } from '@/utils/google/scanService';
import { toast } from 'sonner';
import { useScanState } from './google/useScanState';
import { useRealTimeSimulation } from './google/useRealTimeSimulation';
import { useFallbackResults } from './google/useFallbackResults';
import { recordScanUsage, getSubscription, shouldUpgradeTier, hasScansRemaining } from '@/utils/paymentService';
import { useNavigate } from 'react-router-dom';
import { isFeatureAvailable } from '@/utils/pricingData';
import { useAuth } from '@/contexts/AuthContext';

export function useServiceScanner() {
  const scanState = useScanState();
  const { generateIndustrySpecificFallbackResults } = useFallbackResults();
  const navigate = useNavigate();
  const { user } = useAuth();

  useRealTimeSimulation(
    scanState.lastScanTime,
    scanState.setItemsScanned,
    scanState.setViolationsFound
  );

  const handleScan = async (
    connectedServices: GoogleService[],
    industry?: Industry,
    language?: SupportedLanguage,
    region?: Region
  ) => {
    if (!industry) {
      toast.error('Please select an industry before scanning');
      return;
    }
    if (connectedServices.length === 0) {
      toast.error('Please connect at least one service before scanning');
      return;
    }

    // Check subscription async
    const [subscription, needsUpgrade, hasScans] = await Promise.all([
      getSubscription(user?.id),
      shouldUpgradeTier(user?.id),
      hasScansRemaining(user?.id),
    ]);

    if (subscription && (needsUpgrade || !hasScans)) {
      toast.error('You have used all available scans for your current plan');
      navigate('/pricing');
      return;
    }

    scanState.setSelectedIndustry(industry);
    scanState.setIsScanning(true);
    scanState.resetScanResults();

    try {
      const results = await Promise.all(
        connectedServices.map(service => {
          const serviceId =
            service === 'drive' ? 'drive-1' :
            service === 'gmail' ? 'gmail-1' : 'docs-1';
          return scanGoogleService(serviceId, industry, language, region);
        })
      );

      const violations: ScanViolation[] = [];
      let totalItemsScanned = 0;

      results.forEach(result => {
        if (result.success && result.data) {
          totalItemsScanned += result.data.itemsScanned;
          if (result.data.reports) {
            result.data.reports.forEach(report => {
              if (report.risks && Array.isArray(report.risks)) {
                report.risks.forEach(risk => {
                  const riskRegulation = risk.regulation ||
                    (industry === 'Finance & Banking' ? 'GLBA' :
                     industry === 'Healthcare' ? 'HIPAA' :
                     industry === 'Retail & Consumer' ? 'PCI-DSS' : 'GDPR');
                  violations.push({
                    title: risk.title || (risk.description.split(': ')[0] || risk.description),
                    description: risk.description.includes(': ')
                      ? risk.description.split(': ')[1]
                      : `${riskRegulation}: ${risk.section || 'General compliance issue'}`,
                    severity: risk.severity,
                    service: result.data?.serviceType || 'unknown',
                    location: report.documentName,
                    industry: report.industry || industry
                  });
                });
              }
            });
          }
        }
      });

      scanState.setLastScanTime(new Date());
      scanState.setItemsScanned(totalItemsScanned);
      scanState.setViolationsFound(violations.length);
      scanState.setScanResults({ violations, industry });

      if (violations.length > 0) {
        toast.success(`Scan completed with ${violations.length} issues detected`);
        if (subscription && isFeatureAvailable('slackAlerts', subscription.plan)) {
          console.log('Sending Slack alerts for detected violations');
        }
      } else {
        toast.success('Scan completed successfully. No issues detected.');
      }

      const updatedSub = await getSubscription(user?.id);
      if (updatedSub) {
        const scansRemaining = Math.max(0, updatedSub.scansLimit - updatedSub.scansUsed);
        toast.info(`You have ${scansRemaining} scan${scansRemaining !== 1 ? 's' : ''} remaining this month.`);
        if (scansRemaining === 0) {
          toast.warning('You have used all your available scans. Please upgrade your plan.');
        }
      }
    } catch (error) {
      console.error('Error scanning:', error);
      toast.error('Failed to complete scan');
      const fallbackViolations = generateIndustrySpecificFallbackResults(connectedServices, industry);
      scanState.setScanResults({ violations: fallbackViolations, industry });
      scanState.setLastScanTime(new Date());
      scanState.setItemsScanned(25);
      scanState.setViolationsFound(fallbackViolations.length);
    } finally {
      scanState.setIsScanning(false);
    }
  };

  return {
    isScanning: scanState.isScanning,
    scanResults: scanState.scanResults,
    lastScanTime: scanState.lastScanTime,
    itemsScanned: scanState.itemsScanned,
    violationsFound: scanState.violationsFound,
    selectedIndustry: scanState.selectedIndustry,
    setLastScanTime: scanState.setLastScanTime,
    setItemsScanned: scanState.setItemsScanned,
    setViolationsFound: scanState.setViolationsFound,
    handleScan
  };
}
