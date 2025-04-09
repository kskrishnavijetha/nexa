
import { useState } from 'react';
import { generateAuditReport, generateAuditLogsPDF, getAuditReportFileName, getAuditLogsFileName } from '@/utils/auditReportService';
import { AuditEvent } from '../types';
import { toast } from 'sonner';
import { Industry } from '@/utils/types';
import { generateVerificationMetadata } from '@/utils/audit/hashVerification';

export function useAuditReport(documentName: string, auditEvents: AuditEvent[], industry?: Industry) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGeneratingLogs, setIsGeneratingLogs] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadAuditReport = async () => {
    if (isGeneratingReport) return;
    
    setIsGeneratingReport(true);
    setProgress(10);
    toast.info('Generating audit report...', { duration: 2000 });
    
    try {
      console.log(`[useAuditReport] Generating report for ${documentName} with ${auditEvents.length} events`);
      console.log(`[useAuditReport] Industry explicitly selected: ${industry || 'not specified'}`);
      
      // Show immediate feedback to user with progress
      const toastId = 'report-generation';
      toast.loading('Processing your report...', { id: toastId });
      
      // Generate verification metadata including hash for the report
      setProgress(30);
      const verificationMetadata = await generateVerificationMetadata(auditEvents);
      console.log(`[useAuditReport] Generated verification hash: ${verificationMetadata.shortHash}`);
      setProgress(50);
      
      // Update toast to show progress
      toast.loading('Building PDF document...', { id: toastId });
      
      // Make sure we're using the industry from props first, before trying to detect it
      setProgress(70);
      const reportBlob = await generateAuditReport(documentName, auditEvents, industry, verificationMetadata);
      
      // Update toast before download starts
      toast.loading('Preparing download...', { id: toastId });
      setProgress(90);
      
      // Use a small timeout to ensure UI updates before download starts
      setTimeout(() => {
        // Create download link
        const url = window.URL.createObjectURL(reportBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = getAuditReportFileName(documentName);
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Clean up - important for memory management
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          setProgress(100);
          
          toast.dismiss(toastId);
          toast.success('Audit report downloaded successfully');
          
          // Reset state after small delay
          setTimeout(() => {
            setIsGeneratingReport(false);
            setProgress(0);
          }, 500);
        }, 100);
      }, 50);
      
      console.log(`[useAuditReport] Report successfully generated for industry: ${industry || 'General'}`);
    } catch (error) {
      console.error('[useAuditReport] Error generating report:', error);
      toast.dismiss('report-generation');
      toast.error('Failed to generate audit report');
      setIsGeneratingReport(false);
      setProgress(0);
    }
  };

  const downloadAuditLogs = async () => {
    if (isGeneratingLogs) return;
    
    setIsGeneratingLogs(true);
    setProgress(10);
    toast.info('Generating audit logs PDF...', { duration: 2000 });
    
    try {
      console.log(`[useAuditReport] Generating logs PDF for ${documentName} with ${auditEvents.length} events`);
      
      // Show immediate feedback to user with progress
      const toastId = 'logs-generation';
      toast.loading('Processing your logs...', { id: toastId });
      
      // Generate verification metadata including hash for the logs
      setProgress(30);
      const verificationMetadata = await generateVerificationMetadata(auditEvents);
      setProgress(50);
      
      // Update toast to show progress
      toast.loading('Building PDF document...', { id: toastId });
      
      const logsBlob = await generateAuditLogsPDF(documentName, auditEvents, verificationMetadata);
      setProgress(80);
      
      // Update toast before download starts
      toast.loading('Preparing download...', { id: toastId });
      setProgress(90);
      
      // Use a small timeout to ensure UI updates before download starts
      setTimeout(() => {
        // Create download link
        const url = window.URL.createObjectURL(logsBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = getAuditLogsFileName(documentName);
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Clean up - important for memory management
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          setProgress(100);
          
          toast.dismiss(toastId);
          toast.success('Audit logs downloaded successfully');
          
          // Reset state after small delay
          setTimeout(() => {
            setIsGeneratingLogs(false);
            setProgress(0);
          }, 500);
        }, 100);
      }, 50);
    } catch (error) {
      console.error('[useAuditReport] Error generating logs PDF:', error);
      toast.dismiss('logs-generation');
      toast.error('Failed to generate audit logs PDF');
      setIsGeneratingLogs(false);
      setProgress(0);
    }
  };

  return {
    isGeneratingReport,
    isGeneratingLogs,
    progress,
    downloadAuditReport,
    downloadAuditLogs
  };
}
