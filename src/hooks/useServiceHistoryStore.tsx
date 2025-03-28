
import { useState, useEffect, useCallback } from 'react';
import { ServiceScanHistory } from '@/components/audit/types';
import { useAuth } from '@/contexts/AuthContext';

// Base key for localStorage
const SERVICE_HISTORY_BASE_KEY = 'compliZen_service_history';

// Get user-specific storage key
const getUserStorageKey = (userId: string | undefined) => {
  return userId ? `${SERVICE_HISTORY_BASE_KEY}_${userId}` : SERVICE_HISTORY_BASE_KEY;
};

// Mock data for non-authenticated users
const getMockData = (): ServiceScanHistory[] => {
  return [
    {
      serviceId: 'drive-1',
      serviceName: 'Google Drive',
      documentName: 'XYZ Manufacturing Quality.pdf',
      scanDate: new Date('2025-03-27T15:25:06').toISOString(),
      itemsScanned: 23,
      violationsFound: 2,
      report: {
        id: 'report-101',
        documentId: 'doc-101',
        documentName: 'XYZ Manufacturing Quality.pdf',
        timestamp: new Date('2025-03-27T15:25:06').toISOString(),
        overallScore: 78,
        gdprScore: 85,
        hipaaScore: 72,
        soc2Score: 80,
        risks: [
          { id: 'risk-101', severity: 'medium', regulation: 'GDPR', description: 'Missing data retention policy: Document does not specify data retention period.' },
          { id: 'risk-102', severity: 'low', regulation: 'SOC2', description: 'Access control: Insufficient detail on access permissions.' }
        ],
        summary: 'Manufacturing quality documentation with minor compliance issues in data retention and access control specifications.'
      }
    },
    {
      serviceId: 'drive-1',
      serviceName: 'Google Drive',
      documentName: 'XYZ University Student Privacy.pdf',
      scanDate: new Date('2025-03-27T15:22:21').toISOString(),
      itemsScanned: 55,
      violationsFound: 0,
      report: {
        id: 'report-102',
        documentId: 'doc-102',
        documentName: 'XYZ University Student Privacy.pdf',
        timestamp: new Date('2025-03-27T15:22:21').toISOString(),
        overallScore: 96,
        gdprScore: 98,
        hipaaScore: 95,
        soc2Score: 94,
        risks: [],
        summary: 'Well-structured student privacy policy fully compliant with relevant regulations.'
      }
    },
    {
      serviceId: 'drive-1',
      serviceName: 'Google Drive',
      documentName: 'XYZ Bank Anti.pdf',
      scanDate: new Date('2025-03-27T15:20:54').toISOString(),
      itemsScanned: 44,
      violationsFound: 4,
      report: {
        id: 'report-103',
        documentId: 'doc-103',
        documentName: 'XYZ Bank Anti.pdf',
        timestamp: new Date('2025-03-27T15:20:54').toISOString(),
        overallScore: 65,
        gdprScore: 62,
        hipaaScore: 70,
        soc2Score: 64,
        risks: [
          { id: 'risk-201', severity: 'high', regulation: 'GDPR', description: 'Data breach notification: No clear process for notifying users of data breaches.' },
          { id: 'risk-202', severity: 'medium', regulation: 'GDPR', description: 'Cross-border data transfer: Missing safeguards for international data transfers.' },
          { id: 'risk-203', severity: 'medium', regulation: 'SOC2', description: 'Monitoring controls: Insufficient regular monitoring processes.' },
          { id: 'risk-204', severity: 'low', regulation: 'HIPAA', description: 'Documentation: Minor inconsistencies in documentation format.' }
        ],
        summary: 'Anti-money laundering documentation with several compliance issues, particularly around data breach notification and cross-border transfers.'
      }
    }
  ];
};

export const useServiceHistoryStore = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ServiceScanHistory[]>([]);
  const [lastUserId, setLastUserId] = useState<string | undefined>(undefined);
  
  // Load history when user changes
  useEffect(() => {
    console.log('User changed, reloading history data', user?.id);
    
    // If the user ID has changed, we need to clear the existing history
    // This prevents data leakage between users
    if (lastUserId && user?.id !== lastUserId) {
      console.log('User ID changed, clearing history data');
      setHistory([]);
    }
    
    // Update the last user ID
    setLastUserId(user?.id);
    
    // Important: Clear existing history first to prevent data leakage
    if (!user?.id) {
      console.log('No user logged in, showing mock data');
      setHistory(getMockData());
      return;
    }
    
    // Try to load user-specific history from localStorage
    try {
      const storageKey = getUserStorageKey(user.id);
      const storedData = localStorage.getItem(storageKey);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log(`Loaded history for user ${user.id}, count:`, parsedData.length);
        setHistory(parsedData);
      } else {
        console.log(`No stored history found for user ${user.id}`);
        setHistory([]);
      }
    } catch (error) {
      console.error('Error loading history from localStorage:', error);
      setHistory([]);
    }
  }, [user?.id]);

  // Save service history to localStorage with user-specific key
  const saveServiceHistory = useCallback((historyData: ServiceScanHistory[]) => {
    try {
      if (!user?.id) {
        console.log('Not saving history - no authenticated user');
        return;
      }
      
      const storageKey = getUserStorageKey(user.id);
      localStorage.setItem(storageKey, JSON.stringify(historyData));
      console.log(`Saved history for user ${user.id}, count: ${historyData.length}`);
    } catch (error) {
      console.error('Error saving service history to localStorage:', error);
    }
  }, [user?.id]);

  const addScanHistory = useCallback((scan: ServiceScanHistory) => {
    // Don't save scans for non-authenticated users
    if (!user?.id) {
      console.log('Not saving scan history - no authenticated user');
      return;
    }
    
    setHistory(prevHistory => {
      const newHistory = [scan, ...prevHistory];
      // Limit history to most recent 50 items
      const updatedHistory = newHistory.slice(0, 50);
      
      // Save to localStorage with user-specific key
      saveServiceHistory(updatedHistory);
      return updatedHistory;
    });
  }, [saveServiceHistory, user?.id]);

  const clearHistory = useCallback(() => {
    // Only attempt to clear local storage if a user is logged in
    if (user?.id) {
      try {
        const storageKey = getUserStorageKey(user.id);
        localStorage.removeItem(storageKey);
        console.log(`Cleared history for user ${user.id}`);
      } catch (error) {
        console.error('Error clearing service history:', error);
      }
    }
    
    setHistory([]);
  }, [user?.id]);

  const getServiceHistory = useCallback((serviceId?: string) => {
    if (!serviceId) return history;
    return history.filter(item => item.serviceId === serviceId);
  }, [history]);

  return {
    scanHistory: history,
    addScanHistory,
    clearHistory,
    getServiceHistory
  };
};
