
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { assessContentRisk } from '@/utils/risk';

export function useRealTimeSimulation(
  lastScanTime: Date | undefined,
  setItemsScanned: (value: number) => void,
  setViolationsFound: (value: number) => void
) {
  // Use refs to keep track of current values
  const itemsScannedRef = useRef<number>(0);
  const violationsFoundRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const contentBufferRef = useRef<string[]>([
    "customer data transfer procedures",
    "employee personal information storage",
    "client social security processing",
    "patient medical history records",
    "payment processing system",
    "credit card transactions handling"
  ]);
  
  // Real-time updates for connected services
  useEffect(() => {
    // Clear existing interval if any
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (lastScanTime) {
      // Perform real-time scanning of monitored content
      intervalRef.current = window.setInterval(() => {
        // Simulate content changes by selecting random content to scan
        const contentToScan = contentBufferRef.current[
          Math.floor(Math.random() * contentBufferRef.current.length)
        ];
        
        // Add to items scanned count (limit to prevent excessive growth)
        const newItemsScanned = Math.min(Math.floor(Math.random() * 5), 3);
        itemsScannedRef.current += newItemsScanned;
        setItemsScanned(itemsScannedRef.current);
        
        // Perform real risk assessment on the content
        const risks = assessContentRisk(contentToScan, ['GDPR', 'HIPAA', 'PCI-DSS']);
        
        // Update violations if risks were found
        if (risks.length > 0) {
          violationsFoundRef.current += risks.length;
          setViolationsFound(violationsFoundRef.current);
          toast.warning(`New compliance issue detected: ${risks[0].title}`, {
            description: risks[0].description
          });
        }
      }, 15000); // Update every 15 seconds
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [lastScanTime, setItemsScanned, setViolationsFound]);
}
