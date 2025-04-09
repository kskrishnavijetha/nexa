
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
    
    // Create a toast ID to update throughout the process
    const toastId = toast.loading('Generating audit report...');
    
    try {
      console.log(`[useAuditReport] Generating report for ${documentName} with ${auditEvents.length} events`);
      console.log(`[useAuditReport] Industry explicitly selected: ${industry || 'not specified'}`);
      
      // Break up the process to prevent UI freezing
      await new Promise(resolve => setTimeout(resolve, 50));
      setProgress(20);
      
      // Generate verification metadata including hash for the report
      toast.loading('Processing audit data...', { id: toastId });
      setProgress(30);
      
      // Use a timeout to allow UI to update
      const verificationMetadata = await new Promise<any>(resolve => {
        setTimeout(async () => {
          const metadata = await generateVerificationMetadata(auditEvents);
          resolve(metadata);
        }, 50);
      });
      
      console.log(`[useAuditReport] Generated verification hash: ${verificationMetadata.shortHash}`);
      setProgress(50);
      
      // Update toast to show progress
      toast.loading('Building PDF document...', { id: toastId });
      setProgress(70);
      
      // Make sure we're using the industry from props first, before trying to detect it
      const reportBlob = await new Promise<Blob>(resolve => {
        setTimeout(async () => {
          const blob = await generateAuditReport(documentName, auditEvents, industry, verificationMetadata);
          resolve(blob);
        }, 50);
      });
      
      // Update toast before download starts
      toast.loading('Preparing download...', { id: toastId });
      setProgress(90);
      
      // Use setTimeout for final operations to ensure UI updates
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
          }, 200);
        }, 100);
      }, 50);
      
      console.log(`[useAuditReport] Report successfully generated for industry: ${industry || 'General'}`);
    } catch (error) {
      console.error('[useAuditReport] Error generating report:', error);
      toast.dismiss(toastId);
      toast.error('Failed to generate audit report');
      setIsGeneratingReport(false);
      setProgress(0);
    }
  };

  const downloadAuditLogs = async () => {
    if (isGeneratingLogs) return;
    
    setIsGeneratingLogs(true);
    setProgress(10);
    
    const toastId = toast.loading('Generating audit logs PDF...');
    
    try {
      console.log(`[useAuditReport] Generating logs PDF for ${documentName} with ${auditEvents.length} events`);
      
      // Allow UI to update by breaking up tasks
      await new Promise(resolve => setTimeout(resolve, 50));
      setProgress(30);
      
      // Generate verification metadata including hash for the logs
      const verificationMetadata = await generateVerificationMetadata(auditEvents);
      setProgress(50);
      
      // Update toast to show progress
      toast.loading('Building PDF document...', { id: toastId });
      
      // Generate logs with a small delay to prevent UI freeze
      const logsBlob = await new Promise<Blob>(resolve => {
        setTimeout(async () => {
          const blob = await generateAuditLogsPDF(documentName, auditEvents, verificationMetadata);
          resolve(blob);
        }, 50);
      });
      
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
          }, 200);
        }, 100);
      }, 50);
    } catch (error) {
      console.error('[useAuditReport] Error generating logs PDF:', error);
      toast.dismiss(toastId);
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
