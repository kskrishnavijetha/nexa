
import { createContext, useContext } from 'react';
import { AuditEvent } from '../types';
import { Industry } from '@/utils/types';

interface AuditTrailContextType {
  auditEvents: AuditEvent[];
  setLastActivity: (time: Date) => void;
  downloadAuditReport: () => void;
  isGeneratingReport: boolean;
  loadingEvents: boolean;
  documentName: string;
  industry?: Industry;
}

export const AuditTrailContext = createContext<AuditTrailContextType | undefined>(undefined);

export const useAuditTrail = () => {
  const context = useContext(AuditTrailContext);
  
  if (!context) {
    throw new Error('useAuditTrail must be used within an AuditTrailProvider');
  }
  
  return context;
};
