
import React, { useMemo } from 'react';
import AuditTrailContext from './context/AuditTrailContext';
import { useAuditEventManager } from './hooks/useAuditEventManager';
import { useAuditReport } from './hooks/useAuditReport';
import { AuditEvent } from './types';
import { Industry } from '@/utils/types';
import { generateVerificationCode } from '@/utils/audit/hashVerification';

interface AuditTrailProviderProps {
  documentName: string;
  children: React.ReactNode;
  initialEvents?: AuditEvent[];
  industry?: Industry;
}

export const AuditTrailProvider: React.FC<AuditTrailProviderProps> = ({
  documentName,
  children,
  initialEvents,
  industry,
}) => {
  const {
    auditEvents,
    isLoading,
    addAuditEvent,
    updateTaskStatus,
    updateAuditEvents,
    setLastActivity
  } = useAuditEventManager(documentName, initialEvents);

  const {
    isGeneratingReport,
    isGeneratingLogs,
    downloadAuditReport,
    downloadAuditLogs
  } = useAuditReport(documentName, auditEvents, industry);

  // Generate SHA-256 verification code for the audit trail
  const verificationCode = useMemo(() => {
    if (auditEvents.length === 0) return undefined;
    const code = generateVerificationCode(documentName, auditEvents);
    console.log(`[AuditTrailProvider] Generated SHA-256 verification code for ${documentName}: ${code}`);
    return code;
  }, [documentName, auditEvents]);

  const value = {
    auditEvents,
    isLoading,
    isGeneratingReport,
    isGeneratingLogs,
    downloadAuditReport,
    downloadAuditLogs,
    addAuditEvent,
    updateTaskStatus,
    updateAuditEvents,
    setLastActivity,
    industry,
    verificationCode
  };

  return (
    <AuditTrailContext.Provider value={value}>
      {children}
    </AuditTrailContext.Provider>
  );
};

// Re-export the context hook for easy access
export { useAuditTrail } from './context/AuditTrailContext';
