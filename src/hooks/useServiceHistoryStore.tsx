
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ComplianceReport } from '@/utils/types';

interface ScanHistoryItem {
  serviceId: string;
  serviceName: string;
  scanDate: string;
  itemsScanned: number;
  violationsFound: number;
  documentName?: string;
  report?: ComplianceReport;
}

interface ServiceHistoryState {
  scanHistory: ScanHistoryItem[];
  addScanHistory: (item: ScanHistoryItem) => void;
  clearHistory: () => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

// Helper function to generate a storage key based on user ID
const getStorageKey = (userId: string | null) => {
  if (!userId) return 'compliZen_serviceHistory';
  return `compliZen_serviceHistory_${userId}`;
};

export const useServiceHistoryStore = create<ServiceHistoryState>()(
  persist(
    (set, get) => ({
      scanHistory: [],
      userId: null,
      
      setUserId: (id: string | null) => {
        const currentUserId = get().userId;
        
        // If user ID is changing, clear the history
        if (currentUserId !== id) {
          console.log(`User ID changed from ${currentUserId} to ${id}, resetting history`);
          set({ scanHistory: [], userId: id });
        } else {
          set({ userId: id });
        }
      },
      
      addScanHistory: (item: ScanHistoryItem) => {
        const userId = get().userId;
        
        // Only add history if we have a user ID
        if (userId) {
          console.log(`Adding scan history for user ${userId}`, item);
          set((state) => ({
            scanHistory: [item, ...state.scanHistory],
          }));
        } else {
          console.warn('Attempted to add scan history without a user ID');
        }
      },
      
      clearHistory: () => {
        console.log('Clearing scan history');
        set({ scanHistory: [] });
      },
    }),
    {
      name: 'compliZen_serviceHistory',
      // Use a dynamic storage key based on user ID
      getStorage: (userID) => ({
        getItem: (name) => {
          const userId = JSON.parse(localStorage.getItem('compliZen_userId') || 'null');
          const key = getStorageKey(userId);
          return localStorage.getItem(key) || null;
        },
        setItem: (name, value) => {
          const state = JSON.parse(value);
          const userId = state.state.userId;
          
          // Save the user ID separately for later retrieval
          if (userId) {
            localStorage.setItem('compliZen_userId', JSON.stringify(userId));
          }
          
          const key = getStorageKey(userId);
          localStorage.setItem(key, value);
        },
        removeItem: (name) => {
          const userId = JSON.parse(localStorage.getItem('compliZen_userId') || 'null');
          const key = getStorageKey(userId);
          localStorage.removeItem(key);
          localStorage.removeItem('compliZen_userId');
        },
      }),
    }
  )
);
