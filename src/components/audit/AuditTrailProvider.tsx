
import React, { createContext, useContext } from 'react';
import { AuditEvent } from './types';
import { useAuditEvents } from './hooks/useAuditEvents';
import { useComments } from './hooks/useComments';
import { useTaskStatus } from './hooks/useTaskStatus';

interface AuditTrailContextType {
  auditEvents: AuditEvent[];
  newComment: { [key: string]: string };
  expandedEvent: string | null;
  handleAddComment: (eventId: string) => void;
  handleCommentChange: (eventId: string, value: string) => void;
  toggleEventExpansion: (eventId: string) => void;
  updateTaskStatus: (eventId: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

const AuditTrailContext = createContext<AuditTrailContextType | undefined>(undefined);

export const useAuditTrail = () => {
  const context = useContext(AuditTrailContext);
  if (!context) {
    throw new Error('useAuditTrail must be used within an AuditTrailProvider');
  }
  return context;
};

interface AuditTrailProviderProps {
  children: React.ReactNode;
  documentName: string;
}

export const AuditTrailProvider: React.FC<AuditTrailProviderProps> = ({ children, documentName }) => {
  const {
    auditEvents,
    updateAuditEvents,
    addSystemResponse,
    setLastActivity
  } = useAuditEvents({ documentName });

  const {
    newComment,
    expandedEvent,
    handleAddComment,
    handleCommentChange,
    toggleEventExpansion
  } = useComments({
    auditEvents,
    updateAuditEvents,
    addSystemResponse,
    setLastActivity
  });

  const { updateTaskStatus } = useTaskStatus({
    auditEvents,
    updateAuditEvents,
    documentName,
    setLastActivity
  });

  const contextValue: AuditTrailContextType = {
    auditEvents,
    newComment,
    expandedEvent,
    handleAddComment,
    handleCommentChange,
    toggleEventExpansion,
    updateTaskStatus
  };

  return (
    <AuditTrailContext.Provider value={contextValue}>
      {children}
    </AuditTrailContext.Provider>
  );
};
