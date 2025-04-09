import { createContext } from 'react';
import { AuditEvent, AuditEventStatus } from '../types';
import { Industry } from '@/utils/types';

interface AuditTrailContextData {
  auditEvents: AuditEvent[];
  isLoading: boolean;
  isGeneratingReport: boolean;
  isGeneratingLogs: boolean;
  downloadAuditReport: () => void;
  downloadAuditLogs: () => void;
  addAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  updateTaskStatus: (eventId: string, newStatus: AuditEventStatus) => void;
  updateAuditEvents: (events: AuditEvent[]) => void;
  setLastActivity: (date: Date) => void;
  industry?: Industry;
  progress?: number; // Add progress property
}

const AuditTrailContext = createContext<AuditTrailContextData>({
  auditEvents: [],
  isLoading: false,
  isGeneratingReport: false,
  isGeneratingLogs: false,
  downloadAuditReport: () => {},
  downloadAuditLogs: () => {},
  addAuditEvent: () => {},
  updateTaskStatus: () => {},
  updateAuditEvents: () => {},
  setLastActivity: () => {},
  progress: 0, // Initialize progress
});

export const useAuditTrail = () => {
  return React.useContext(AuditTrailContext);
};

export default AuditTrailContext;
