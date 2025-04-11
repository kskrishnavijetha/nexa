
import { useState } from 'react';
import { generateAuditReport, generateAuditLogsPDF, getAuditReportFileName, getAuditLogsFileName } from '@/utils/auditReportService';
import { AuditEvent } from '../types';
import { toast } from 'sonner';
import { Industry } from '@/utils/types';
import { generateVerificationMetadata } from '@/utils/audit/hashVerification';

export function useAuditReport(documentName: string, auditEvents: AuditEvent[], industry?: Industry) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGeneratingLogs, setIsGeneratingLogs] = useState(false);

  const downloadAuditReport = async () => {
    if (isGeneratingReport) return;
    
    setIsGeneratingReport(true);
    const toastId = toast.loading('Generating audit report...', { duration: 30000 });
    
    try {
      console.log(`[useAuditReport] Generating report for ${documentName} with ${auditEvents.length} events`);
      console.log(`[useAuditReport] Industry explicitly selected: ${industry || 'not specified'}`);
      
      // Use requestAnimationFrame to ensure UI updates before heavy operation
      requestAnimationFrame(async () => {
        try {
          // Generate integrity verification metadata
          const verificationMetadata = await generateVerificationMetadata(auditEvents);
          console.log(`[useAuditReport] Generated verification hash: ${verificationMetadata.shortHash}`);
          
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
          
          // Clean up - important for memory management
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.dismiss(toastId);
            toast.success('Audit report downloaded successfully');
            setIsGeneratingReport(false);
          }, 100);
          
          console.log(`[useAuditReport] Report successfully generated for industry: ${industry || 'General'}`);
        } catch (error) {
          console.error('[useAuditReport] Error in animation frame:', error);
          toast.dismiss(toastId);
          toast.error('Failed to generate audit report');
          setIsGeneratingReport(false);
        }
      });
    } catch (error) {
      console.error('[useAuditReport] Error generating report:', error);
      toast.dismiss(toastId);
      toast.error('Failed to generate audit report');
      setIsGeneratingReport(false);
    }
  };

  const downloadAuditLogs = async () => {
    if (isGeneratingLogs) return;
    
    setIsGeneratingLogs(true);
    const toastId = toast.loading('Generating audit logs PDF...', { duration: 30000 });
    
    try {
      console.log(`[useAuditReport] Generating logs PDF for ${documentName} with ${auditEvents.length} events`);
      
      // Use requestAnimationFrame to ensure UI updates before heavy operation
      requestAnimationFrame(async () => {
        try {
          // Generate integrity verification metadata
          const verificationMetadata = await generateVerificationMetadata(auditEvents);
          console.log(`[useAuditReport] Generated verification hash for logs: ${verificationMetadata.shortHash}`);
          
          const logsBlob = await generateAuditLogsPDF(documentName, auditEvents);
          
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
            toast.dismiss(toastId);
            toast.success('Audit logs downloaded successfully');
            setIsGeneratingLogs(false);
          }, 100);
        } catch (error) {
          console.error('[useAuditReport] Error in animation frame:', error);
          toast.dismiss(toastId);
          toast.error('Failed to generate audit logs PDF');
          setIsGeneratingLogs(false);
        }
      });
    } catch (error) {
      console.error('[useAuditReport] Error generating logs PDF:', error);
      toast.dismiss(toastId);
      toast.error('Failed to generate audit logs PDF');
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
