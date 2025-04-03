
import { useState } from 'react';
import { generatePDFReport, getAuditReportFileName } from '@/utils/audit';
import { AuditEvent } from '../types';
import { toast } from 'sonner';
import { Industry } from '@/utils/types';

export function useAuditReport(documentName: string, auditEvents: AuditEvent[], industry?: Industry) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const downloadAuditReport = async () => {
    if (isGeneratingReport) return;
    
    setIsGeneratingReport(true);
    toast.info('Generating audit report...');
    
    try {
      console.log(`Generating report for ${documentName} with ${auditEvents.length} events and industry: ${industry || 'not specified'}`);
      const reportBlob = await generatePDFReport(documentName, auditEvents, industry);
      
      // Create download link
      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getAuditReportFileName(documentName);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Add the report generation as an audit event
      // This would be done through the context in a real app
      console.log(`Report successfully generated for industry: ${industry || 'General'}`);
      
      toast.success('Audit report downloaded successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate audit report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return {
    isGeneratingReport,
    downloadAuditReport
  };
}
