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
  
  // Keep track of last update time to prevent too frequent updates
  const lastUpdateRef = useRef<number>(Date.now());
  
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
        // Throttle updates to prevent excessive UI pressure
        const now = Date.now();
        if (now - lastUpdateRef.current < 5000) {
          return;
        }
        
        lastUpdateRef.current = now;
        
        // Simulate content changes by selecting random content to scan
        const contentToScan = contentBufferRef.current[
          Math.floor(Math.random() * contentBufferRef.current.length)
        ];
        
        // Add to items scanned count (limit to prevent excessive growth)
        const newItemsScanned = Math.min(Math.floor(Math.random() * 5), 3);
        itemsScannedRef.current += newItemsScanned;
        
        // Limit the total items scanned to prevent excessive numbers
        if (itemsScannedRef.current > 10000) {
          itemsScannedRef.current = 9800 + Math.floor(Math.random() * 200);
        }
        
        setItemsScanned(itemsScannedRef.current);
        
        // Perform real risk assessment on the content
        const risks = assessContentRisk(contentToScan, ['GDPR', 'HIPAA', 'PCI-DSS']);
        
        // Update violations if risks were found
        if (risks.length > 0) {
          violationsFoundRef.current += risks.length;
          
          // Limit the total violations to prevent excessive numbers
          if (violationsFoundRef.current > 1000) {
            violationsFoundRef.current = 950 + Math.floor(Math.random() * 50);
          }
          
          setViolationsFound(violationsFoundRef.current);
          
          // Show notification about new violations only occasionally to reduce UI noise
          if (Math.random() < 0.3) {
            toast.warning(`New compliance issue detected: ${risks[0].title}`, {
              description: risks[0].description,
              duration: 3000
            });
          }
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
