
import { useEffect, useState } from 'react';

export const useRealTimeMonitoring = (isConnected: boolean) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState<boolean>(false);
  const [realtimeTimer, setRealtimeTimer] = useState<number | null>(null);

  // Real-time updates simulation
  useEffect(() => {
    if (isConnected && isRealTimeActive) {
      // Set up interval for real-time updates
      const interval = window.setInterval(() => {
        setLastUpdated(new Date());
      }, 10000); // Update every 10 seconds
      
      setRealtimeTimer(interval);
      
      return () => {
        if (realtimeTimer !== null) {
          window.clearInterval(realtimeTimer);
        }
      };
    } else if (!isRealTimeActive && realtimeTimer !== null) {
      window.clearInterval(realtimeTimer);
      setRealtimeTimer(null);
    }
  }, [isConnected, isRealTimeActive, realtimeTimer]);

  // Auto-activate real-time mode when connected
  useEffect(() => {
    if (isConnected) {
      setIsRealTimeActive(true);
    } else {
      setIsRealTimeActive(false);
    }
  }, [isConnected]);

  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };

  return {
    lastUpdated,
    isRealTimeActive,
    realtimeTimer,
    toggleRealTime
  };
};
