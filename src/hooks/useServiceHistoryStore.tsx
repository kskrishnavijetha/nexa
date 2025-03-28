import { create } from 'zustand';
import { persist, StorageValue, PersistStorage } from 'zustand/middleware';
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
  if (!userId) return 'compliZen_serviceHistory_guest';
  return `compliZen_serviceHistory_${userId}`;
};

// Custom storage implementation to handle user-specific storage
const createUserStorage = (): PersistStorage<ServiceHistoryState> => {
  return {
    getItem: (name: string): StorageValue<ServiceHistoryState> | null => {
      try {
        const stateStr = localStorage.getItem(name);
        if (!stateStr) return null;
        
        const parsedState = JSON.parse(stateStr);
        const userId = parsedState.state.userId;
        
        // If we have a userId, use a user-specific key
        if (userId) {
          const key = getStorageKey(userId);
          const userStateStr = localStorage.getItem(key);
          
          // Handle the case where user-specific storage doesn't exist
          if (!userStateStr) return null;
          
          // Parse and return as the correct type
          return JSON.parse(userStateStr);
        }
        
        // Otherwise, use the default key (already parsed)
        return parsedState;
      } catch (e) {
        console.error('Error parsing state during getItem:', e);
        return null;
      }
    },
    
    setItem: (name: string, value: StorageValue<ServiceHistoryState>): void => {
      try {
        // Convert value to string for localStorage
        const valueStr = JSON.stringify(value);
        const parsedState = JSON.parse(valueStr);
        const userId = parsedState.state.userId;
        
        // If we have a userId, use a user-specific key
        if (userId) {
          const key = getStorageKey(userId);
          localStorage.setItem(key, valueStr);
        }
        
        // Always update the main store with at least the userId
        const mainStore = { state: { userId: parsedState.state.userId } };
        localStorage.setItem(name, JSON.stringify(mainStore));
      } catch (e) {
        console.error('Error stringifying state during setItem:', e);
      }
    },
    
    removeItem: (name: string): void => {
      try {
        const stateStr = localStorage.getItem(name);
        if (stateStr) {
          const parsedState = JSON.parse(stateStr);
          const userId = parsedState.state?.userId;
          
          // If we have a userId, remove the user-specific key
          if (userId) {
            const key = getStorageKey(userId);
            localStorage.removeItem(key);
          }
        }
        
        localStorage.removeItem(name);
      } catch (e) {
        console.error('Error parsing state during removeItem:', e);
        // Still attempt to remove the item even if parsing failed
        localStorage.removeItem(name);
      }
    }
  };
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
          
          // Clear the history in localStorage for the previous user
          if (currentUserId) {
            const prevKey = getStorageKey(currentUserId);
            localStorage.removeItem(prevKey);
          }
          
          set({ scanHistory: [], userId: id });
          
          // Load history for the new user if available
          if (id) {
            const newKey = getStorageKey(id);
            const savedHistory = localStorage.getItem(newKey);
            
            if (savedHistory) {
              try {
                const parsedHistory = JSON.parse(savedHistory);
                if (parsedHistory.state && Array.isArray(parsedHistory.state.scanHistory)) {
                  set({ scanHistory: parsedHistory.state.scanHistory });
                  console.log(`Loaded ${parsedHistory.state.scanHistory.length} history items for user ${id}`);
                }
              } catch (e) {
                console.error('Error parsing history:', e);
              }
            }
          }
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
      // Use the custom storage implementation
      storage: createUserStorage()
    }
  )
);
