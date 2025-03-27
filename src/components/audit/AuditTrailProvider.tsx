
import React, { createContext, useContext, useState } from 'react';
import { AuditEvent } from './types';
import { useAuditEvents } from './hooks/useAuditEvents';
import { useComments } from './hooks/useComments';
import { useTaskStatus } from './hooks/useTaskStatus';
import { generateAuditReport, getAuditReportFileName } from '@/utils/auditReportService';
import { toast } from 'sonner';

interface AuditTrailContextType {
  auditEvents: AuditEvent[];
  newComment: { [key: string]: string };
  expandedEvent: string | null;
  isGeneratingReport: boolean;
  handleAddComment: (eventId: string) => void;
  handleCommentChange: (eventId: string, value: string) => void;
  toggleEventExpansion: (eventId: string) => void;
  updateTaskStatus: (eventId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  downloadAuditReport: () => Promise<void>;
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
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

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

  const downloadAuditReport = async () => {
    if (auditEvents.length === 0) {
      toast.error("No audit events to generate a report");
      return;
    }

    try {
      setIsGeneratingReport(true);
      
      // Generate the report
      const pdfBlob = await generateAuditReport(documentName, auditEvents);
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getAuditReportFileName(documentName);
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      toast.success("Audit report downloaded successfully");
      
      // Add an audit event for the report download
      addSystemResponse({
        message: "Audit report was downloaded",
        status: "completed"
      });
    } catch (error) {
      console.error("Failed to generate audit report:", error);
      toast.error("Failed to generate audit report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const contextValue: AuditTrailContextType = {
    auditEvents,
    newComment,
    expandedEvent,
    isGeneratingReport,
    handleAddComment,
    handleCommentChange,
    toggleEventExpansion,
    updateTaskStatus,
    downloadAuditReport
  };

  return (
    <AuditTrailContext.Provider value={contextValue}>
      {children}
    </AuditTrailContext.Provider>
  );
};
