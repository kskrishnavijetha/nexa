
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { AuditEvent } from '../types';
import { generateAuditReport, getAuditReportFileName } from '@/utils/auditReportService';

export function useAuditReport(documentName: string, auditEvents: AuditEvent[]) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const downloadAuditReport = useCallback(async () => {
    if (auditEvents.length === 0) {
      toast.error('No audit events to include in the report');
      return;
    }
    
    try {
      setIsGeneratingReport(true);
      console.log(`Starting report generation for ${documentName} with ${auditEvents.length} events`);
      
      const reportBlob = await generateAuditReport(documentName, auditEvents);
      
      // Create a download link
      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getAuditReportFileName(documentName);
      
      // Append to body, click and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Audit report downloaded successfully');
    } catch (error) {
      console.error('Error generating audit report:', error);
      toast.error('Failed to generate audit report: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGeneratingReport(false);
    }
  }, [auditEvents, documentName]);

  return {
    isGeneratingReport,
    downloadAuditReport
  };
}
