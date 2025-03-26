
import { useState, useEffect } from 'react';
import { GoogleService } from '@/components/google/types';
import { SupportedLanguage } from '@/utils/language';
import { Industry, Region } from '@/utils/types';
import { scanGoogleService } from '@/utils/google/scanService';
import { scanMicrosoftService } from '@/utils/microsoft/microsoftServices';
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
    setScanResults(null);
    
    try {
      // Scan each connected service
      const results = await Promise.all(
        connectedServices.map(service => {
          console.log(`Scanning service: ${service}`);
          
          const serviceId = 
            service === 'drive' ? 'drive-1' : 
            service === 'gmail' ? 'gmail-1' : 
            service === 'docs' ? 'docs-1' :
            service === 'sharepoint' ? 'sharepoint-1' :
            service === 'outlook' ? 'outlook-1' : 'teams-1';
            
          // Determine if this is a Google or Microsoft service
          const isMicrosoftService = service === 'sharepoint' || 
                                     service === 'outlook' || 
                                     service === 'teams';
                                     
          // Call the appropriate scanning function
          return isMicrosoftService
            ? scanMicrosoftService(serviceId, industry, language, region)
            : scanGoogleService(serviceId, industry, language, region);
        })
      );
      
      console.log('Scan results:', results);
      
      // Combine results and properly format them as ScanViolation objects
      const violations: ScanViolation[] = [];
      let totalItemsScanned = 0;
      
      results.forEach(result => {
        if (result.data) {
          totalItemsScanned += result.data.itemsScanned;
          
          if (result.data.reports) {
            result.data.reports.forEach(report => {
              // Each risk item in the report becomes a violation
              report.risks.forEach(risk => {
                violations.push({
                  title: risk.description.split(': ')[0] || risk.description,
                  description: risk.description.includes(': ') ? 
                    risk.description.split(': ')[1] : 
                    `${risk.regulation}: ${risk.section || 'General compliance issue'}`,
                  severity: risk.severity,
                  service: result.data?.serviceType || 'unknown',
                  location: report.documentName
                });
              });
            });
          }
        }
      });
      
      console.log('Processed violations:', violations);
      
      setLastScanTime(new Date());
      setItemsScanned(totalItemsScanned);
      setViolationsFound(violations.length);
      setScanResults({ violations });
      toast.success('Scan completed successfully');
    } catch (error) {
      console.error('Error scanning:', error);
      toast.error('Failed to complete scan');
    } finally {
      setIsScanning(false);
    }
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
