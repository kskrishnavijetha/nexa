
import { createContext, useContext } from 'react';
import { AuditEvent } from '../types';
import { Industry } from '@/utils/types';

interface AuditTrailContextType {
  auditEvents: AuditEvent[];
  isLoading: boolean;
  isGeneratingReport: boolean;
  downloadAuditReport: () => void;
  downloadJSON: () => void;
  downloadCSV: () => void; 
  downloadPDF: () => void;
  addAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  updateTaskStatus: (eventId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  updateAuditEvents: (events: AuditEvent[]) => void;
  setLastActivity: (date: Date) => void;
  industry?: Industry;
  documentName: string; // Make documentName required
}

const AuditTrailContext = createContext<AuditTrailContextType | undefined>(undefined);

export default AuditTrailContext;

export const useAuditTrail = () => {
  const context = useContext(AuditTrailContext);
  if (context === undefined) {
    throw new Error('useAuditTrail must be used within a AuditTrailProvider');
  }
  return context;
};
