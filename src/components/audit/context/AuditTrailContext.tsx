
import { createContext, useContext } from 'react';
import { AuditEvent } from '../types';
import { Industry } from '@/utils/types';

interface AuditTrailContextType {
  auditEvents: AuditEvent[];
  isLoading: boolean;
  isGeneratingReport: boolean;
  downloadAuditReport: () => Promise<void>;
  downloadAuditLogReport: () => Promise<void>;
  addAuditEvent: (event: Omit<AuditEvent, 'id'>) => void;
  updateTaskStatus: (eventId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  updateAuditEvents: (events: AuditEvent[]) => void;
  setLastActivity: (activity: Date) => void;
  industry?: Industry;
}

const AuditTrailContext = createContext<AuditTrailContextType>({
  auditEvents: [],
  isLoading: false,
  isGeneratingReport: false,
  downloadAuditReport: async () => {},
  downloadAuditLogReport: async () => {},
  addAuditEvent: () => {},
  updateTaskStatus: () => {},
  updateAuditEvents: () => {},
  setLastActivity: () => {},
});

export const useAuditTrail = () => useContext(AuditTrailContext);

export default AuditTrailContext;
