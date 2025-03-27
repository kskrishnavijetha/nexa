
import React from 'react';
import AuditTrailContext from './context/AuditTrailContext';
import { useAuditEventManager } from './hooks/useAuditEventManager';
import { useAuditReport } from './hooks/useAuditReport';

interface AuditTrailProviderProps {
  documentName: string;
  children: React.ReactNode;
}

export const AuditTrailProvider: React.FC<AuditTrailProviderProps> = ({
  documentName,
  children,
}) => {
  const {
    auditEvents,
    isLoading,
    addAuditEvent,
    updateTaskStatus
  } = useAuditEventManager(documentName);

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
    updateTaskStatus
  };

  return (
    <AuditTrailContext.Provider value={value}>
      {children}
    </AuditTrailContext.Provider>
  );
};

// Re-export the context hook for easy access
export { useAuditTrail } from './context/AuditTrailContext';
