
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AuditTrailContext from './context/AuditTrailContext';
import { useAuditEventManager } from './hooks/useAuditEventManager';
import { useAuditReport } from './hooks/useAuditReport';
import { AuditEvent } from './types';
import { Industry } from '@/utils/types';
import { exportReportAsCSV, exportReportAsDOCX } from '@/utils/reports/exportFormats';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

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
    downloadAuditReport
  } = useAuditReport(documentName, auditEvents, industry);

  // Download audit logs as JSON
  const downloadJSON = () => {
    try {
      const jsonData = JSON.stringify(auditEvents, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const filename = `audit-logs-${documentName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      saveAs(blob, filename);
      toast.success('Audit logs downloaded as JSON');
    } catch (error) {
      console.error('Error downloading JSON:', error);
      toast.error('Failed to download JSON');
    }
  };

  // Download audit logs as CSV
  const downloadCSV = () => {
    try {
      // Create header row
      let csvContent = 'ID,Timestamp,Action,User,Status,Document\n';
      
      // Add data rows
      auditEvents.forEach(event => {
        const timestamp = event.timestamp.replace(/,/g, '');
        const action = event.action.replace(/,/g, '');
        const user = event.user.replace(/,/g, '');
        const status = event.status || '';
        csvContent += `${event.id},${timestamp},"${action}","${user}",${status},"${event.documentName}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const filename = `audit-logs-${documentName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
      saveAs(blob, filename);
      toast.success('Audit logs downloaded as CSV');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download CSV');
    }
  };

  // Download audit logs as PDF (uses the existing audit report functionality)
  const downloadPDF = () => {
    downloadAuditReport();
  };

  const value = {
    auditEvents,
    isLoading,
    isGeneratingReport,
    downloadAuditReport,
    downloadJSON,
    downloadCSV,
    downloadPDF,
    addAuditEvent,
    updateTaskStatus,
    updateAuditEvents,
    setLastActivity,
    industry,
    documentName
  };

  return (
    <AuditTrailContext.Provider value={value}>
      {children}
    </AuditTrailContext.Provider>
  );
};

// Re-export the context hook for easy access
export { useAuditTrail } from './context/AuditTrailContext';
