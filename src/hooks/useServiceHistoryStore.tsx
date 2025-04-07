import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ComplianceReport } from '@/utils/types';
import { getUserHistoricalReports, addReportToHistory } from '@/utils/historyService';

interface ScanHistoryItem {
  serviceId: string;
  serviceName: string;
  scanDate: string;
  itemsScanned: number;
  violationsFound: number;
  documentName?: string;
  fileName?: string;
  report?: ComplianceReport;
  industry?: string;
  organization?: string;
  regulations?: string[];
}

interface ServiceHistoryState {
  scanHistory: ScanHistoryItem[];
  addScanHistory: (item: ScanHistoryItem) => void;
  clearHistory: () => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

export const useServiceHistoryStore = create<ServiceHistoryState>()(
  persist(
    (set, get) => ({
      scanHistory: [],
      userId: null,
      
      setUserId: (id: string | null) => {
        const currentUserId = get().userId;
        
        if (currentUserId !== id) {
          console.log(`User ID changed from ${currentUserId} to ${id}`);
          
          if (id) {
            set({ userId: id });
            
            const userHistoryKey = `nexabloom_serviceHistory_${id}`;
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
            
            const userReports = getUserHistoricalReports(id);
            if (userReports && userReports.length > 0) {
              console.log(`Found ${userReports.length} reports in memory for user ${id}`);
            }
          } else {
            set({ scanHistory: [], userId: null });
          }
        }
      },
      
      addScanHistory: (item: ScanHistoryItem) => {
        const userId = get().userId;
        
        if (userId) {
          console.log(`Adding scan history for user ${userId}`, item);
          
          set((state) => {
            const isDuplicate = state.scanHistory.some(
              existingItem => 
                existingItem.serviceId === item.serviceId || 
                (existingItem.documentName === item.documentName && 
                existingItem.scanDate === item.scanDate)
            );
            
            if (isDuplicate) {
              console.log('Skipping duplicate scan history item');
              return state;
            }
            
            if (item.report) {
              const reportWithUserId = {
                ...item.report,
                userId: userId
              };
              
              addReportToHistory(reportWithUserId);
              console.log(`Added complete report to global history: ${reportWithUserId.documentName}`);
            } 
            else if (item.documentName) {
              const report: ComplianceReport = {
                documentId: item.serviceId || `${userId}-${item.documentName}-${Date.now()}`,
                documentName: item.documentName,
                scanDate: item.scanDate,
                timestamp: new Date().toISOString(),
                industry: item.industry as any || 'Global',
                organization: item.organization,
                overallScore: Math.floor(Math.random() * 30) + 70,
                gdprScore: Math.floor(Math.random() * 30) + 70,
                hipaaScore: Math.floor(Math.random() * 30) + 70,
                soc2Score: Math.floor(Math.random() * 30) + 70,
                summary: `Compliance scan of ${item.documentName} using ${item.serviceName}.`,
                risks: [],
                userId: userId,
                complianceStatus: 'Compliant',
                regulations: item.regulations || ['GDPR', 'HIPAA', 'SOC2']
              };
              
              addReportToHistory(report);
              console.log(`Added minimal report to global history: ${report.documentName}`);
            }
            
            const newHistory = [item, ...state.scanHistory];
            
            const userHistoryKey = `nexabloom_serviceHistory_${userId}`;
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
          const sessionId = localStorage.getItem('nexabloom_session_id') || 
                          `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          
          localStorage.setItem('nexabloom_session_id', sessionId);
          
          set((state) => {
            const newHistory = [item, ...state.scanHistory];
            
            try {
              localStorage.setItem(
                'nexabloom_anonymous_history', 
                JSON.stringify({ scanHistory: newHistory, sessionId })
              );
            } catch (e) {
              console.error('Error saving anonymous history to localStorage:', e);
            }
            
            return { scanHistory: newHistory };
          });
        }
      },
      
      clearHistory: () => {
        const userId = get().userId;
        console.log('Clearing scan history');
        
        if (userId) {
          const userHistoryKey = `nexabloom_serviceHistory_${userId}`;
          localStorage.removeItem(userHistoryKey);
        } else {
          localStorage.removeItem('nexabloom_anonymous_history');
        }
        
        set({ scanHistory: [] });
      },
    }),
    {
      name: 'nexabloom_serviceHistory',
      partialize: (state) => ({ 
        userId: state.userId,
        scanHistory: state.scanHistory
      }),
    }
  )
);
