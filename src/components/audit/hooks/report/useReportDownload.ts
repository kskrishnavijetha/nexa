
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { AuditEvent } from '../../types';
import { generateAuditReport, getAuditReportFileName } from '@/utils/auditReportService';
import { Industry } from '@/utils/types';
import { generateVerificationMetadata } from '@/utils/audit/hashVerification';

/**
 * Hook for handling audit report generation and download
 */
export function useReportDownload(documentName: string, auditEvents: AuditEvent[], industry?: Industry) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const progressToastIdRef = useRef<string | number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Optimized download implementation with better memory management
  const downloadAuditReport = useCallback(async () => {
    if (isGeneratingReport) return;
    
    setIsGeneratingReport(true);
    setProgressPercent(0);
    
    // Create abort controller for potential cancellation
    abortControllerRef.current = new AbortController();
    
    progressToastIdRef.current = toast.loading('Preparing audit report (0%)...', { duration: 60000 });
    
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
    }, 300); // Slightly less frequent updates for performance
    
    try {
      console.log(`[useAuditReport] Generating report for ${documentName} with ${auditEvents.length} events`);
      console.log(`[useAuditReport] Industry explicitly selected: ${industry || 'not specified'}`);
      
      // Use requestAnimationFrame to ensure UI updates before heavy operation
      requestAnimationFrame(async () => {
        try {
          // Use microtasks for better UI priority
          queueMicrotask(async () => {
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
              
              // Trigger download - use visibility:hidden instead of appending to document
              link.style.position = 'absolute';
              link.style.visibility = 'hidden';
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
                abortControllerRef.current = null;
              }, 100);
              
              console.log(`[useAuditReport] Report successfully generated for industry: ${industry || 'General'}`);
            } catch (error) {
              handleError(error, progressInterval);
            }
          });
        } catch (error) {
          handleError(error, progressInterval);
        }
      });
    } catch (error) {
      handleError(error, progressInterval);
    }
  }, [auditEvents, documentName, industry, isGeneratingReport]);

  // Helper function for error handling to avoid repetition
  const handleError = (error: unknown, interval: NodeJS.Timeout) => {
    console.error('[useAuditReport] Error generating report:', error);
    clearInterval(interval);
    if (progressToastIdRef.current) {
      toast.error('Failed to generate audit report', {
        id: progressToastIdRef.current
      });
      progressToastIdRef.current = null;
    }
    setIsGeneratingReport(false);
    setProgressPercent(0);
    abortControllerRef.current = null;
  };

  return {
    isGeneratingReport,
    downloadAuditReport,
    progressPercent
  };
}
