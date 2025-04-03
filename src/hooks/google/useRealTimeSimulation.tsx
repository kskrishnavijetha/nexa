import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useRealTimeSimulation(
  lastScanTime: Date | undefined,
  setItemsScanned: (value: number) => void,
  setViolationsFound: (value: number) => void
) {
  // Use refs to keep track of current values
  const itemsScannedRef = useRef<number>(0);
  const violationsFoundRef = useRef<number>(0);
  
  // Real-time simulation for connected services
  useEffect(() => {
    let interval: number | null = null;
    
    if (lastScanTime) {
      // Simulate real-time updates for connected services
      interval = window.setInterval(() => {
        // Simulate random changes to items scanned
        const randomChange = Math.floor(Math.random() * 5);
        itemsScannedRef.current += randomChange;
        setItemsScanned(itemsScannedRef.current);
        
        // Occasionally add a new violation
        if (Math.random() > 0.8) {
          violationsFoundRef.current += 1;
          setViolationsFound(violationsFoundRef.current);
          toast.info(`New potential compliance issue detected`);
        }
      }, 15000); // Update every 15 seconds
    }
    
    return () => {
      if (interval !== null) {
        window.clearInterval(interval);
      }
    };
  }, [lastScanTime, setItemsScanned, setViolationsFound]);
}
