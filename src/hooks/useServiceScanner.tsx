
import { useState } from 'react';
import { GoogleService, ScanResults, ScanViolation } from '@/components/google/types';
import { SupportedLanguage } from '@/utils/language';
import { Industry, Region } from '@/utils/types';
import { scanGoogleService } from '@/utils/google/scanService';
import { toast } from 'sonner';
import { useScanState } from './google/useScanState';
import { useRealTimeSimulation } from './google/useRealTimeSimulation';
import { useFallbackResults } from './google/useFallbackResults';
import { recordScanUsage, getSubscription, shouldUpgradeTier } from '@/utils/paymentService';

export function useServiceScanner() {
  const scanState = useScanState();
  const { generateIndustrySpecificFallbackResults } = useFallbackResults();
  
  // Setup real-time simulation
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
    
    // Check if the user has reached scan limit before continuing
    const shouldUpgrade = await shouldUpgradeTier();
    if (shouldUpgrade) {
      toast.error('You have used all available scans for your current plan');
      return;
    }
    
    console.log('Starting scan with:', { connectedServices, industry, language, region });
    
    // Record scan usage - the actual counting is done in recordScanUsage
    // No need to call this here as it's already called in ScannerControls
    
    // Store the selected industry for later reference
    scanState.setSelectedIndustry(industry);
    scanState.setIsScanning(true);
    scanState.resetScanResults(); // Clear previous results
    
    try {
      // Scan each connected service, always passing the explicit industry
      const results = await Promise.all(
        connectedServices.map(service => {
          console.log(`Scanning service: ${service} for industry: ${industry}`);
          
          const serviceId = 
            service === 'drive' ? 'drive-1' : 
            service === 'gmail' ? 'gmail-1' : 'docs-1';
            
          return scanGoogleService(serviceId, industry, language, region);
        })
      );
      
      console.log('Scan results:', results);
      
      // Combine results and properly format them as ScanViolation objects
      const violations: ScanViolation[] = [];
      let totalItemsScanned = 0;
      
      results.forEach(result => {
        if (result.success && result.data) {
          totalItemsScanned += result.data.itemsScanned;
          
          if (result.data.reports) {
            result.data.reports.forEach(report => {
              // Each risk item in the report becomes a violation
              if (report.risks && Array.isArray(report.risks)) {
                report.risks.forEach(risk => {
                  // Make sure to use the correct industry-specific regulations
                  const riskRegulation = risk.regulation || 
                    (industry === 'Finance & Banking' ? 'GLBA' : 
                     industry === 'Healthcare' ? 'HIPAA' : 
                     industry === 'Retail & Consumer' ? 'PCI-DSS' : 'GDPR');
                     
                  violations.push({
                    title: risk.title || (risk.description.split(': ')[0] || risk.description),
                    description: risk.description.includes(': ') ? 
                      risk.description.split(': ')[1] : 
                      `${riskRegulation}: ${risk.section || 'General compliance issue'}`,
                    severity: risk.severity,
                    service: result.data?.serviceType || 'unknown',
                    location: report.documentName,
                    industry: report.industry || industry // Include the industry in the violation
                  });
                });
              }
            });
          }
        }
      });
      
      console.log('Processed violations for industry:', industry, violations);
      
      // Set results in state
      scanState.setLastScanTime(new Date());
      scanState.setItemsScanned(totalItemsScanned);
      scanState.setViolationsFound(violations.length);
      scanState.setScanResults({ violations, industry }); // Updated format
      
      if (violations.length > 0) {
        toast.success(`Scan completed with ${violations.length} issues detected`);
      } else {
        toast.success('Scan completed successfully. No issues detected.');
      }
      
      // Show remaining scans after completion
      const subscription = await getSubscription();
      if (subscription) {
        const scansRemaining = subscription.scansLimit - subscription.scansUsed;
        toast.info(`You have ${scansRemaining} scan${scansRemaining !== 1 ? 's' : ''} remaining this month.`);
      }
    } catch (error) {
      console.error('Error scanning:', error);
      toast.error('Failed to complete scan');
      
      // Provide industry-specific fallback scan results for demo purposes
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
