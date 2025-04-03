
import { useState, useEffect } from 'react';
import { GoogleService } from '@/components/google/types';
import { SupportedLanguage } from '@/utils/language';
import { Industry, Region, RiskSeverity } from '@/utils/types';
import { scanGoogleService } from '@/utils/google/scanService';
import { toast } from 'sonner';
import { ScanViolation, ScanResults } from '@/components/google/types';

export function useServiceScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [lastScanTime, setLastScanTime] = useState<Date | undefined>(undefined);
  const [itemsScanned, setItemsScanned] = useState<number>(0);
  const [violationsFound, setViolationsFound] = useState<number>(0);

  // Real-time simulation for connected services
  useEffect(() => {
    let interval: number | null = null;
    
    if (lastScanTime) {
      // Simulate real-time updates for connected services
      interval = window.setInterval(() => {
        // Simulate random changes to items scanned
        const randomChange = Math.floor(Math.random() * 5);
        setItemsScanned(prev => prev + randomChange);
        
        // Occasionally add a new violation
        if (Math.random() > 0.8) {
          setViolationsFound(prev => prev + 1);
          toast.info(`New potential compliance issue detected`);
        }
      }, 15000); // Update every 15 seconds
    }
    
    return () => {
      if (interval !== null) {
        window.clearInterval(interval);
      }
    };
  }, [lastScanTime]);

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
    
    console.log('Starting scan with:', { connectedServices, industry, language, region });
    
    setIsScanning(true);
    setScanResults(null); // Clear previous results
    
    try {
      // Scan each connected service
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
                    location: report.documentName
                  });
                });
              }
            });
          }
        }
      });
      
      console.log('Processed violations for industry:', industry, violations);
      
      // Set results in state
      setLastScanTime(new Date());
      setItemsScanned(totalItemsScanned);
      setViolationsFound(violations.length);
      setScanResults({ violations });
      
      if (violations.length > 0) {
        toast.success(`Scan completed with ${violations.length} issues detected`);
      } else {
        toast.success('Scan completed successfully. No issues detected.');
      }
    } catch (error) {
      console.error('Error scanning:', error);
      toast.error('Failed to complete scan');
      
      // Provide industry-specific fallback scan results for demo purposes
      generateIndustrySpecificFallbackResults(connectedServices, industry);
    } finally {
      setIsScanning(false);
    }
  };

  // Generate industry-specific fallback results for demo purposes
  const generateIndustrySpecificFallbackResults = (connectedServices: GoogleService[], industry?: Industry) => {
    let fallbackViolations: ScanViolation[] = [];
    
    switch(industry) {
      case 'Finance & Banking':
        fallbackViolations = [
          {
            title: 'PCI Data Retention',
            description: 'Financial documents exceed retention policy',
            severity: 'medium' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Financial Records'
          },
          {
            title: 'Customer Financial Information',
            description: 'Unencrypted account numbers detected',
            severity: 'high' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Customer Files'
          }
        ];
        break;
        
      case 'Healthcare':
        fallbackViolations = [
          {
            title: 'PHI Exposure Risk',
            description: 'Patient health information in unsecured document',
            severity: 'high' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Patient Records'
          },
          {
            title: 'HIPAA Consent Forms',
            description: 'Missing signed authorization forms',
            severity: 'medium' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Consent Forms'
          }
        ];
        break;
        
      case 'Retail & Consumer':
        fallbackViolations = [
          {
            title: 'Credit Card Information',
            description: 'PCI-DSS violation: stored card data',
            severity: 'high' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Sales Records'
          },
          {
            title: 'Customer Personal Data',
            description: 'Customer data shared without consent',
            severity: 'medium' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Marketing Lists'
          }
        ];
        break;
        
      // Default case for other industries
      default:
        fallbackViolations = [
          {
            title: 'Data Retention Policy',
            description: 'Documents exceed maximum retention period',
            severity: 'medium' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Shared Documents'
          },
          {
            title: 'Sensitive Information',
            description: 'PII detected in unsecured document',
            severity: 'high' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Personal Files'
          }
        ];
    }
    
    setScanResults({ violations: fallbackViolations });
    setLastScanTime(new Date());
    setItemsScanned(25);
    setViolationsFound(fallbackViolations.length);
  };

  return {
    isScanning,
    scanResults,
    lastScanTime,
    itemsScanned,
    violationsFound,
    setLastScanTime,
    setItemsScanned,
    setViolationsFound,
    handleScan
  };
}
