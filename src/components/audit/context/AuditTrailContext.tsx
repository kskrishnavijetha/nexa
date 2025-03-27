
import React, { createContext, useContext } from 'react';
import { AuditEvent } from '../types';

interface AuditTrailContextProps {
  auditEvents: AuditEvent[];
  isLoading: boolean;
  isGeneratingReport: boolean;
  downloadAuditReport: () => Promise<void>;
  addAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  updateTaskStatus: (eventId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  updateAuditEvents?: (events: AuditEvent[]) => void;
}

const AuditTrailContext = createContext<AuditTrailContextProps | null>(null);

export const useAuditTrail = () => {
  const context = useContext(AuditTrailContext);
  if (!context) {
    throw new Error('useAuditTrail must be used within an AuditTrailProvider');
  }
  return context;
};

export default AuditTrailContext;
