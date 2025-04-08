
import { useState } from 'react';
import { generateAuditReport, generateAuditLogReport, getAuditReportFileName } from '@/utils/auditReportService';
import { AuditEvent } from '../types';
import { toast } from 'sonner';
import { Industry } from '@/utils/types';

export function useAuditReport(documentName: string, auditEvents: AuditEvent[], industry?: Industry) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const downloadAuditReport = async () => {
    if (isGeneratingReport) return;
    
    setIsGeneratingReport(true);
    toast.info('Generating full audit report...');
    
    try {
      console.log(`[useAuditReport] Generating report for ${documentName} with ${auditEvents.length} events`);
      console.log(`[useAuditReport] Industry explicitly selected: ${industry || 'not specified'}`);
      
      // Calculate compliance scores based on completed events
      const totalEvents = auditEvents.length;
      const completedEvents = auditEvents.filter(event => event.status === 'completed').length;
      const complianceScore = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 100;
      const complianceStatus = complianceScore >= 80 ? 'Compliant' : 'Non-Compliant';
      
      // Make sure we're using the industry from props first, before trying to detect it
      const reportBlob = await generateAuditReport(
        documentName, 
        auditEvents, 
        industry,
        complianceScore,
        complianceStatus
      );
      
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
      console.log(`[useAuditReport] Compliance score: ${complianceScore}%, Status: ${complianceStatus}`);
      
      toast.success('Audit report downloaded successfully');
    } catch (error) {
      console.error('[useAuditReport] Error generating report:', error);
      toast.error('Failed to generate audit report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const downloadAuditLogReport = async () => {
    if (isGeneratingReport) return;
    
    setIsGeneratingReport(true);
    toast.info('Generating audit logs report...');
    
    try {
      console.log(`[useAuditReport] Generating logs-only report for ${documentName} with ${auditEvents.length} events`);
      
      // Make sure we're using the industry from props first, before trying to detect it
      const reportBlob = await generateAuditLogReport(documentName, auditEvents);
      
      // Create download link
      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Audit logs report downloaded successfully');
    } catch (error) {
      console.error('[useAuditReport] Error generating logs report:', error);
      toast.error('Failed to generate audit logs report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return {
    isGeneratingReport,
    downloadAuditReport,
    downloadAuditLogReport
  };
}
