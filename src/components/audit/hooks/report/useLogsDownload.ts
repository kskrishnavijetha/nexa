
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { AuditEvent } from '../../types';
import { generateAuditLogsPDF, getAuditLogsFileName } from '@/utils/auditReportService';
import { generateVerificationMetadata } from '@/utils/audit/hashVerification';

/**
 * Hook for handling audit logs generation and download
 */
export function useLogsDownload(documentName: string, auditEvents: AuditEvent[]) {
  const [isGeneratingLogs, setIsGeneratingLogs] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const progressToastIdRef = useRef<string | number | null>(null);

  const downloadAuditLogs = useCallback(async () => {
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
    }, 300);
    
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
          
          // Create download link with optimized approach
          const url = window.URL.createObjectURL(logsBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = getAuditLogsFileName(documentName);
          link.style.position = 'absolute';
          link.style.visibility = 'hidden';
          
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
  }, [auditEvents, documentName, isGeneratingLogs]);

  return {
    isGeneratingLogs,
    downloadAuditLogs,
    progressPercent
  };
}
