
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
    const toastId = toast.loading('Preparing audit data...');
    
    try {
      console.log(`[useAuditReport] Generating report for ${documentName} with ${auditEvents.length} events`);
      
      // Stage 1: Prepare data with minimal processing
      setProgress(20);
      toast.loading('Processing audit data...', { id: toastId });
      
      // Generate verification metadata in a non-blocking way
      const verificationMetadata = await new Promise<any>(resolve => {
        // Use requestAnimationFrame to ensure UI updates
        requestAnimationFrame(async () => {
          const metadata = await generateVerificationMetadata(auditEvents);
          resolve(metadata);
        });
      });
      
      setProgress(40);
      
      // Stage 2: PDF Generation - chunked to prevent UI freeze
      toast.loading('Building PDF document...', { id: toastId });
      setProgress(60);
      
      // Generate PDF with optimized settings to reduce processing time
      const reportBlob = await new Promise<Blob>(resolve => {
        // Use requestAnimationFrame instead of setTimeout for better performance
        requestAnimationFrame(async () => {
          const blob = await generateAuditReport(documentName, auditEvents, industry, verificationMetadata);
          resolve(blob);
        });
      });
      
      setProgress(80);
      toast.loading('Finalizing download...', { id: toastId });
      
      // Stage 3: Trigger download with minimal UI blocking
      // Use requestAnimationFrame instead of setTimeout for smoother UI
      requestAnimationFrame(() => {
        // Create download link
        const url = window.URL.createObjectURL(reportBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = getAuditReportFileName(documentName);
        
        // Trigger download
        link.click();
        
        // Clean up immediately to free memory
        window.URL.revokeObjectURL(url);
        setProgress(100);
        
        toast.dismiss(toastId);
        toast.success('Audit report downloaded successfully');
        
        // Reset state immediately
        setIsGeneratingReport(false);
        setProgress(0);
      });
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
    
    const toastId = toast.loading('Preparing audit log data...');
    
    try {
      // Stage 1: Initial preparation
      setProgress(20);
      
      // Generate verification metadata with minimal UI blocking
      const verificationMetadata = await new Promise<any>(resolve => {
        requestAnimationFrame(async () => {
          const metadata = await generateVerificationMetadata(auditEvents);
          resolve(metadata);
        });
      });
      
      setProgress(40);
      toast.loading('Building PDF document...', { id: toastId });
      
      // Stage 2: Generate logs with optimized settings
      const logsBlob = await new Promise<Blob>(resolve => {
        requestAnimationFrame(async () => {
          const blob = await generateAuditLogsPDF(documentName, auditEvents, verificationMetadata);
          resolve(blob);
        });
      });
      
      setProgress(80);
      toast.loading('Finalizing download...', { id: toastId });
      
      // Stage 3: Trigger download with minimal blocking
      requestAnimationFrame(() => {
        // Create download link
        const url = window.URL.createObjectURL(logsBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = getAuditLogsFileName(documentName);
        
        // Trigger download
        link.click();
        
        // Clean up immediately
        window.URL.revokeObjectURL(url);
        setProgress(100);
        
        toast.dismiss(toastId);
        toast.success('Audit logs downloaded successfully');
        
        // Reset state immediately
        setIsGeneratingLogs(false);
        setProgress(0);
      });
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
