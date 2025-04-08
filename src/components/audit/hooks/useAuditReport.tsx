
import { useState } from 'react';
import { generateAuditReport, generateAuditLogsPDF, getAuditReportFileName, getAuditLogsFileName } from '@/utils/auditReportService';
import { AuditEvent } from '../types';
import { toast } from 'sonner';
import { Industry } from '@/utils/types';

export function useAuditReport(documentName: string, auditEvents: AuditEvent[], industry?: Industry) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGeneratingLogs, setIsGeneratingLogs] = useState(false);

  const downloadAuditReport = async () => {
    if (isGeneratingReport) return;
    
    setIsGeneratingReport(true);
    toast.info('Generating audit report...');
    
    try {
      console.log(`[useAuditReport] Generating report for ${documentName} with ${auditEvents.length} events`);
      console.log(`[useAuditReport] Industry explicitly selected: ${industry || 'not specified'}`);
      
      // Make sure we're using the industry from props first, before trying to detect it
      const reportBlob = await generateAuditReport(documentName, auditEvents, industry);
      
      // Create download link
      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getAuditReportFileName(documentName);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`[useAuditReport] Report successfully generated for industry: ${industry || 'General'}`);
      
      toast.success('Audit report downloaded successfully');
    } catch (error) {
      console.error('[useAuditReport] Error generating report:', error);
      toast.error('Failed to generate audit report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const downloadAuditLogs = async () => {
    if (isGeneratingLogs) return;
    
    setIsGeneratingLogs(true);
    toast.info('Generating audit logs PDF...');
    
    try {
      console.log(`[useAuditReport] Generating logs PDF for ${documentName} with ${auditEvents.length} events`);
      
      const logsBlob = await generateAuditLogsPDF(documentName, auditEvents);
      
      // Create download link
      const url = window.URL.createObjectURL(logsBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getAuditLogsFileName(documentName);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Audit logs downloaded successfully');
    } catch (error) {
      console.error('[useAuditReport] Error generating logs PDF:', error);
      toast.error('Failed to generate audit logs PDF');
    } finally {
      setIsGeneratingLogs(false);
    }
  };

  return {
    isGeneratingReport,
    isGeneratingLogs,
    downloadAuditReport,
    downloadAuditLogs
  };
}
