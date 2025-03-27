
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuditEvent } from './types';
import { toast } from 'sonner';
import { generateAuditReport, getAuditReportFileName } from '@/utils/auditReportService';
import { useComments } from './hooks/useComments';
import { useAuditEvents } from './hooks/useAuditEvents';
import { useTaskStatus } from './hooks/useTaskStatus';

interface AuditTrailContextProps {
  auditEvents: AuditEvent[];
  isLoading: boolean;
  isGeneratingReport: boolean;
  downloadAuditReport: () => Promise<void>;
  addAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  newComment: { [key: string]: string };
  expandedEvent: string | null;
  handleAddComment: (eventId: string) => void;
  handleCommentChange: (eventId: string, value: string) => void;
  toggleEventExpansion: (eventId: string) => void;
  updateTaskStatus: (eventId: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

const AuditTrailContext = createContext<AuditTrailContextProps | null>(null);

interface AuditTrailProviderProps {
  documentName: string;
  children: React.ReactNode;
}

export const useAuditTrail = () => {
  const context = useContext(AuditTrailContext);
  if (!context) {
    throw new Error('useAuditTrail must be used within an AuditTrailProvider');
  }
  return context;
};

export const AuditTrailProvider: React.FC<AuditTrailProviderProps> = ({
  documentName,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Initialize audit events using the hook
  const {
    auditEvents,
    updateAuditEvents,
    addSystemResponse,
    setLastActivity: updateLastActivity
  } = useAuditEvents({ documentName });

  // Comments management
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
    setLastActivity: updateLastActivity
  });

  // Task status management
  const { updateTaskStatus } = useTaskStatus({
    auditEvents,
    updateAuditEvents,
    documentName,
    setLastActivity: updateLastActivity
  });

  // Set loading state after initial audit events are loaded
  useEffect(() => {
    if (auditEvents.length > 0) {
      setIsLoading(false);
    }
  }, [auditEvents]);

  const addAuditEvent = useCallback((event: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    const newEvent: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: event.action,
      documentName: event.documentName || documentName,
      user: event.user || 'System',
      status: event.status || 'completed',
      comments: event.comments || [],
      icon: event.icon
    };

    updateAuditEvents([newEvent, ...auditEvents]);
    updateLastActivity(new Date());
    toast.success(`Audit trail updated: ${event.action}`);
  }, [auditEvents, documentName, updateAuditEvents, updateLastActivity]);

  const downloadAuditReport = useCallback(async () => {
    try {
      setIsGeneratingReport(true);
      const reportBlob = await generateAuditReport(documentName, auditEvents);
      
      // Create a download link
      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getAuditReportFileName(documentName);
      
      // Append to body, click and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Audit report downloaded successfully');
    } catch (error) {
      console.error('Error generating audit report:', error);
      toast.error('Failed to generate audit report');
    } finally {
      setIsGeneratingReport(false);
    }
  }, [auditEvents, documentName]);

  const value = {
    auditEvents,
    isLoading,
    isGeneratingReport,
    downloadAuditReport,
    addAuditEvent,
    newComment,
    expandedEvent,
    handleAddComment,
    handleCommentChange,
    toggleEventExpansion,
    updateTaskStatus
  };

  return (
    <AuditTrailContext.Provider value={value}>
      {children}
    </AuditTrailContext.Provider>
  );
};
