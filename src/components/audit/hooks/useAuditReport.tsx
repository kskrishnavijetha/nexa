
import { useState, useRef } from 'react';
import { generateAuditReport, generateAuditLogsPDF, getAuditReportFileName, getAuditLogsFileName } from '@/utils/auditReportService';
import { AuditEvent } from '../types';
import { toast } from 'sonner';
import { Industry } from '@/utils/types';
import { generateVerificationMetadata } from '@/utils/audit/hashVerification';

export function useAuditReport(documentName: string, auditEvents: AuditEvent[], industry?: Industry) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGeneratingLogs, setIsGeneratingLogs] = useState(false);
  const progressToastIdRef = useRef<string | number | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const downloadAuditReport = async () => {
    if (isGeneratingReport) return;
    
    setIsGeneratingReport(true);
    setProgressPercent(0);
    progressToastIdRef.current = toast.loading('Generating audit report (0%)...', { duration: 60000 });
    
    // Update progress periodically to give feedback
    const progressInterval = setInterval(() => {
      setProgressPercent(prev => {
        // Cap at 90% - final 10% when actually complete
        const newValue = Math.min(prev + 5, 90);
        if (progressToastIdRef.current) {
          toast.loading(`Generating audit report (${newValue}%)...`, { 
            id: progressToastIdRef.current 
          });
        }
        return newValue;
      });
    }, 500);
    
    try {
      console.log(`[useAuditReport] Generating report for ${documentName} with ${auditEvents.length} events`);
      console.log(`[useAuditReport] Industry explicitly selected: ${industry || 'not specified'}`);
      
      // Use requestAnimationFrame to ensure UI updates before heavy operation
      requestAnimationFrame(async () => {
        try {
          // Generate integrity verification metadata
          const verificationMetadata = await generateVerificationMetadata(auditEvents);
          console.log(`[useAuditReport] Generated verification hash: ${verificationMetadata.shortHash}`);
          
          if (progressToastIdRef.current) {
            toast.loading('Building PDF document...', { 
              id: progressToastIdRef.current 
            });
          }
          
          // Make sure we're using the industry from props first, before trying to detect it
          const reportBlob = await generateAuditReport(documentName, auditEvents, industry);
          
          clearInterval(progressInterval);
          setProgressPercent(100);
          
          if (progressToastIdRef.current) {
            toast.loading('Download starting (100%)...', { 
              id: progressToastIdRef.current 
            });
          }
          
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
            if (progressToastIdRef.current) {
              toast.success('Audit report downloaded successfully', {
                id: progressToastIdRef.current
              });
              progressToastIdRef.current = null;
            }
            setIsGeneratingReport(false);
            setProgressPercent(0);
          }, 100);
          
          console.log(`[useAuditReport] Report successfully generated for industry: ${industry || 'General'}`);
        } catch (error) {
          console.error('[useAuditReport] Error in animation frame:', error);
          clearInterval(progressInterval);
          if (progressToastIdRef.current) {
            toast.error('Failed to generate audit report', {
              id: progressToastIdRef.current
            });
            progressToastIdRef.current = null;
          }
          setIsGeneratingReport(false);
          setProgressPercent(0);
        }
      });
    } catch (error) {
      console.error('[useAuditReport] Error generating report:', error);
      clearInterval(progressInterval);
      if (progressToastIdRef.current) {
        toast.error('Failed to generate audit report', {
          id: progressToastIdRef.current
        });
        progressToastIdRef.current = null;
      }
      setIsGeneratingReport(false);
      setProgressPercent(0);
    }
  };

  const downloadAuditLogs = async () => {
    if (isGeneratingLogs) return;
    
    setIsGeneratingLogs(true);
    progressToastIdRef.current = toast.loading('Generating audit logs (0%)...', { duration: 60000 });
    setProgressPercent(0);
    
    // Update progress periodically to give feedback
    const progressInterval = setInterval(() => {
      setProgressPercent(prev => {
        // Cap at 90% - final 10% when actually complete
        const newValue = Math.min(prev + 5, 90);
        if (progressToastIdRef.current) {
          toast.loading(`Generating audit logs (${newValue}%)...`, { 
            id: progressToastIdRef.current 
          });
        }
        return newValue;
      });
    }, 500);
    
    try {
      console.log(`[useAuditReport] Generating logs PDF for ${documentName} with ${auditEvents.length} events`);
      
      // Use requestAnimationFrame to ensure UI updates before heavy operation
      requestAnimationFrame(async () => {
        try {
          // Generate integrity verification metadata
          const verificationMetadata = await generateVerificationMetadata(auditEvents);
          console.log(`[useAuditReport] Generated verification hash for logs: ${verificationMetadata.shortHash}`);
          
          if (progressToastIdRef.current) {
            toast.loading('Building PDF document...', { 
              id: progressToastIdRef.current 
            });
          }
          
          const logsBlob = await generateAuditLogsPDF(documentName, auditEvents);
          
          clearInterval(progressInterval);
          setProgressPercent(100);
          
          if (progressToastIdRef.current) {
            toast.loading('Download starting (100%)...', { 
              id: progressToastIdRef.current 
            });
          }
          
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
            if (progressToastIdRef.current) {
              toast.success('Audit logs downloaded successfully', {
                id: progressToastIdRef.current
              });
              progressToastIdRef.current = null;
            }
            setIsGeneratingLogs(false);
            setProgressPercent(0);
          }, 100);
        } catch (error) {
          console.error('[useAuditReport] Error in animation frame:', error);
          clearInterval(progressInterval);
          if (progressToastIdRef.current) {
            toast.error('Failed to generate audit logs PDF', {
              id: progressToastIdRef.current
            });
            progressToastIdRef.current = null;
          }
          setIsGeneratingLogs(false);
          setProgressPercent(0);
        }
      });
    } catch (error) {
      console.error('[useAuditReport] Error generating logs PDF:', error);
      clearInterval(progressInterval);
      if (progressToastIdRef.current) {
        toast.error('Failed to generate audit logs PDF', {
          id: progressToastIdRef.current
        });
        progressToastIdRef.current = null;
      }
      setIsGeneratingLogs(false);
      setProgressPercent(0);
    }
  };

  return {
    isGeneratingReport,
    isGeneratingLogs,
    downloadAuditReport,
    downloadAuditLogs,
    progressPercent
  };
}
