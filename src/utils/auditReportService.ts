
import { AuditEvent } from '@/components/audit/types';
import { generatePDFReport, getAuditReportFileName as getFileName } from './audit';
import { Industry } from '@/utils/types';
import { jsPDF } from 'jspdf';
import { addEventsSection } from './audit/pdf/addEventsSection';
import { addFooter } from './audit/pdf';

/**
 * Generate a downloadable audit trail report PDF with AI insights
 */
export const generateAuditReport = async (
  documentName: string,
  auditEvents: AuditEvent[],
  industry?: Industry
): Promise<Blob> => {
  try {
    console.log(`Generating audit report for ${documentName} with ${auditEvents.length} events`);
    console.log(`Industry for audit report: ${industry || 'not specified'}`);
    return await generatePDFReport(documentName, auditEvents, industry);
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

/**
 * Generate a downloadable audit logs PDF (without AI insights, just the logs)
 */
export const generateAuditLogsPDF = async (
  documentName: string,
  auditEvents: AuditEvent[]
): Promise<Blob> => {
  try {
    console.log(`Generating audit logs PDF for ${documentName} with ${auditEvents.length} events`);
    
    // Create PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });
    
    // Add title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 51, 102);
    pdf.text('Audit Logs', 105, 20, { align: 'center' });
    
    // Add document name
    pdf.setFontSize(12);
    pdf.text(`Document: ${documentName}`, 20, 30);
    
    // Add generation date
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 38);
    
    // Add horizontal line
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(20, 42, 190, 42);
    
    // Add events section
    addEventsSection(pdf, auditEvents, 50);
    
    // Add footer with page numbers
    addFooter(pdf);
    
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating audit logs PDF:', error);
    throw error;
  }
};

/**
 * Generate a standardized filename for the audit report
 */
export const getAuditReportFileName = (documentName: string): string => {
  return getFileName(documentName);
};

/**
 * Generate a standardized filename for the audit logs
 */
export const getAuditLogsFileName = (documentName: string): string => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const sanitizedDocName = documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  return `audit-logs-${sanitizedDocName}-${formattedDate}.pdf`;
};
