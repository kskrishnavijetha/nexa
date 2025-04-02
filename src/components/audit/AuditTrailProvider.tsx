
import React from 'react';
import AuditTrailContext from './context/AuditTrailContext';
import { useAuditEventManager } from './hooks/useAuditEventManager';
import { useAuditReport } from './hooks/useAuditReport';
import { AuditEvent } from './types';

interface AuditTrailProviderProps {
  documentName: string;
  children: React.ReactNode;
  initialEvents?: AuditEvent[];
}

export const AuditTrailProvider: React.FC<AuditTrailProviderProps> = ({
  documentName,
  children,
  initialEvents,
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
    downloadAuditReport
  } = useAuditReport(documentName, auditEvents);

  const value = {
    auditEvents,
    isLoading,
    isGeneratingReport,
    downloadAuditReport,
    addAuditEvent,
    updateTaskStatus,
    updateAuditEvents,
    setLastActivity
  };

  return (
    <AuditTrailContext.Provider value={value}>
      {children}
    </AuditTrailContext.Provider>
  );
};

// Re-export the context hook for easy access
export { useAuditTrail } from './context/AuditTrailContext';
