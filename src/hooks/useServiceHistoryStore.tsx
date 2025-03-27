
import { useState, useEffect, useCallback } from 'react';
import { ServiceScanHistory } from '@/components/audit/types';

// In a real app, this would be persisted to localStorage or a database
let serviceHistory: ServiceScanHistory[] = [];

export const useServiceHistoryStore = () => {
  const [history, setHistory] = useState<ServiceScanHistory[]>(serviceHistory);

  // Initialize from state
  useEffect(() => {
    setHistory(serviceHistory);
  }, []);

  const addScanHistory = useCallback((scan: ServiceScanHistory) => {
    const newHistory = [scan, ...serviceHistory];
    // Limit history to most recent 50 items
    serviceHistory = newHistory.slice(0, 50);
    setHistory(serviceHistory);
  }, []);

  const clearHistory = useCallback(() => {
    serviceHistory = [];
    setHistory([]);
  }, []);

  const getServiceHistory = useCallback((serviceId?: string) => {
    if (!serviceId) return serviceHistory;
    return serviceHistory.filter(item => item.serviceId === serviceId);
  }, []);

  return {
    scanHistory: history,
    addScanHistory,
    clearHistory,
    getServiceHistory
  };
};
