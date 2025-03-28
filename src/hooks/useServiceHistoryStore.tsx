
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
  fileName?: string;
  report?: ComplianceReport;
}

interface ServiceHistoryState {
  scanHistory: ScanHistoryItem[];
  addScanHistory: (item: ScanHistoryItem) => void;
  clearHistory: () => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

// Create the store with persistence
export const useServiceHistoryStore = create<ServiceHistoryState>()(
  persist(
    (set, get) => ({
      scanHistory: [],
      userId: null,
      
      setUserId: (id: string | null) => {
        const currentUserId = get().userId;
        
        // Only update if user ID actually changed
        if (currentUserId !== id) {
          console.log(`User ID changed from ${currentUserId} to ${id}`);
          
          // If we're setting a new user ID, we need to load their history
          if (id) {
            // First reset the history
            set({ scanHistory: [], userId: id });
            
            // Try to load user-specific history
            const userHistoryKey = `compliZen_serviceHistory_${id}`;
            const savedHistory = localStorage.getItem(userHistoryKey);
            
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
          } else {
            // If no user ID (logged out), clear history
            set({ scanHistory: [], userId: null });
          }
        }
      },
      
      addScanHistory: (item: ScanHistoryItem) => {
        const userId = get().userId;
        
        // Only add history if we have a user ID
        if (userId) {
          console.log(`Adding scan history for user ${userId}`, item);
          
          set((state) => {
            // Check for duplicates by serviceId and scanDate
            const isDuplicate = state.scanHistory.some(
              existingItem => 
                existingItem.serviceId === item.serviceId && 
                existingItem.scanDate === item.scanDate &&
                existingItem.documentName === item.documentName
            );
            
            if (isDuplicate) {
              console.log('Skipping duplicate scan history item');
              return state;
            }
            
            // Add new item to front of history
            const newHistory = [item, ...state.scanHistory];
            
            // Also save directly to localStorage for this specific user
            const userHistoryKey = `compliZen_serviceHistory_${userId}`;
            try {
              localStorage.setItem(
                userHistoryKey, 
                JSON.stringify({ state: { scanHistory: newHistory, userId } })
              );
            } catch (e) {
              console.error('Error saving history to localStorage:', e);
            }
            
            return { scanHistory: newHistory };
          });
        } else {
          console.warn('Attempted to add scan history without a user ID');
        }
      },
      
      clearHistory: () => {
        const userId = get().userId;
        console.log('Clearing scan history');
        
        // Clear from localStorage if we have a user ID
        if (userId) {
          const userHistoryKey = `compliZen_serviceHistory_${userId}`;
          localStorage.removeItem(userHistoryKey);
        }
        
        set({ scanHistory: [] });
      },
    }),
    {
      name: 'compliZen_serviceHistory',
      partialize: (state) => ({ 
        userId: state.userId 
      }),
    }
  )
);
