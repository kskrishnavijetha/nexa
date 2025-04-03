
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useRealTimeSimulation(
  lastScanTime: Date | undefined,
  setItemsScanned: (value: number) => void,
  setViolationsFound: (value: number) => void
) {
  // Real-time simulation for connected services
  useEffect(() => {
    let interval: number | null = null;
    
    if (lastScanTime) {
      // Simulate real-time updates for connected services
      interval = window.setInterval(() => {
        // Simulate random changes to items scanned
        const randomChange = Math.floor(Math.random() * 5);
        setItemsScanned((prev: number) => prev + randomChange);
        
        // Occasionally add a new violation
        if (Math.random() > 0.8) {
          setViolationsFound((prev: number) => prev + 1);
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
