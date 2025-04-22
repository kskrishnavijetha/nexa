
import React, { useEffect, useState } from 'react';
import AuditTrailContext from './context/AuditTrailContext';
import { useAuditEventManager } from './hooks/useAuditEventManager';
import { useAuditReport } from './hooks/useAuditReport';
import { AuditEvent } from './types';
import { Industry } from '@/utils/types';
import { generateAuditHash, verifyAuditIntegrity } from '@/utils/audit/hashVerification';

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
  const [currentAuditHash, setCurrentAuditHash] = useState<string>('');
  
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
  
  // Generate and update the audit hash whenever the events change
  useEffect(() => {
    if (auditEvents.length > 0) {
      const updateHash = async () => {
        const hash = await generateAuditHash(auditEvents);
        setCurrentAuditHash(hash);
      };
      
      updateHash();
    }
  }, [auditEvents]);
  
  // Function to verify the integrity of the audit trail
  const verifyIntegrity = async () => {
    // For demo purposes, we'll verify against the current hash
    // In a real application, this would verify against a previously stored hash
    if (!currentAuditHash) return false;
    
    return verifyAuditIntegrity(auditEvents, currentAuditHash);
  };

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
    verifyAuditIntegrity: verifyIntegrity,
    currentAuditHash
  };

  return (
    <AuditTrailContext.Provider value={value}>
      {children}
    </AuditTrailContext.Provider>
  );
};

// Re-export the context hook for easy access
export { useAuditTrail } from './context/AuditTrailContext';
