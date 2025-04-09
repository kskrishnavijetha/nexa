
import React, { createContext, useContext } from 'react';
import { AuditEvent } from '../types';
import { Industry } from '@/utils/types';
import { generateVerificationCode } from '@/utils/audit/hashVerification';

interface AuditTrailContextType {
  auditEvents: AuditEvent[];
  isLoading: boolean;
  isGeneratingReport: boolean;
  isGeneratingLogs: boolean;
  downloadAuditReport: () => Promise<void>;
  downloadAuditLogs: () => Promise<void>;
  addAuditEvent: (event: Partial<AuditEvent>) => void;
  updateTaskStatus: (id: string, status: AuditEvent['status']) => void;
  updateAuditEvents: (events: AuditEvent[]) => void;
  setLastActivity: (date: Date) => void;
  industry?: Industry;
  verificationCode?: string;
}

const defaultContext: AuditTrailContextType = {
  auditEvents: [],
  isLoading: false,
  isGeneratingReport: false,
  isGeneratingLogs: false,
  downloadAuditReport: async () => {},
  downloadAuditLogs: async () => {},
  addAuditEvent: () => {},
  updateTaskStatus: () => {},
  updateAuditEvents: () => {},
  setLastActivity: () => {},
};

const AuditTrailContext = createContext<AuditTrailContextType>(defaultContext);

export const useAuditTrail = () => {
  const context = useContext(AuditTrailContext);
  
  if (context === undefined) {
    throw new Error('useAuditTrail must be used within an AuditTrailProvider');
  }

  // Generate verification code if not already present
  if (!context.verificationCode && context.auditEvents.length > 0) {
    const documentName = context.auditEvents[0].documentName || 'unknown-document';
    const verificationCode = generateVerificationCode(documentName, context.auditEvents);
    return { ...context, verificationCode };
  }
  
  return context;
};

export default AuditTrailContext;
