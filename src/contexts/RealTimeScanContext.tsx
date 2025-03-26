import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScanViolation } from '@/components/google/types';

interface ScanStats {
  itemsScanned: number;
  violationsFound: number;
  lastScanTime: Date | undefined;
  isActive: boolean;
}

interface RealTimeScanContextType {
  globalScanStats: ScanStats;
  updateScanStats: (stats: Partial<ScanStats>) => void;
  recentViolations: ScanViolation[];
  addViolation: (violation: ScanViolation) => void;
  clearViolations: () => void;
}

const defaultContext: RealTimeScanContextType = {
  globalScanStats: {
    itemsScanned: 0,
    violationsFound: 0,
    lastScanTime: undefined,
    isActive: false
  },
  updateScanStats: () => {},
  recentViolations: [],
  addViolation: () => {},
  clearViolations: () => {}
};

const RealTimeScanContext = createContext<RealTimeScanContextType>(defaultContext);

export const useRealTimeScan = () => useContext(RealTimeScanContext);

export const RealTimeScanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalScanStats, setGlobalScanStats] = useState<ScanStats>(defaultContext.globalScanStats);
  const [recentViolations, setRecentViolations] = useState<ScanViolation[]>([]);

  const updateScanStats = (stats: Partial<ScanStats>) => {
    setGlobalScanStats(prev => ({ ...prev, ...stats }));
  };

  const addViolation = (violation: ScanViolation) => {
    setRecentViolations(prev => {
      // Keep only the 5 most recent violations
      const updated = [violation, ...prev.slice(0, 4)];
      
      // Update violation count in global stats
      updateScanStats({ 
        violationsFound: globalScanStats.violationsFound + 1 
      });
      
      return updated;
    });
  };

  const clearViolations = () => {
    setRecentViolations([]);
    updateScanStats({ violationsFound: 0 });
  };

  // Simulate occasional real-time updates when scanning is active
  useEffect(() => {
    let interval: number | null = null;
    
    if (globalScanStats.isActive) {
      interval = window.setInterval(() => {
        // Increment items scanned by a small random amount
        const randomIncrement = Math.floor(Math.random() * 3) + 1;
        updateScanStats({ 
          itemsScanned: globalScanStats.itemsScanned + randomIncrement,
          lastScanTime: new Date()
        });
      }, 8000); // Update every 8 seconds
    }
    
    return () => {
      if (interval !== null) {
        window.clearInterval(interval);
      }
    };
  }, [globalScanStats.isActive, globalScanStats.itemsScanned]);

  return (
    <RealTimeScanContext.Provider 
      value={{ 
        globalScanStats, 
        updateScanStats, 
        recentViolations, 
        addViolation,
        clearViolations
      }}
    >
      {children}
    </RealTimeScanContext.Provider>
  );
};
