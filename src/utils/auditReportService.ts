
import { AuditEvent } from '@/components/audit/types';
import { generatePDFReport, getAuditReportFileName as getFileName } from './audit';
import { Industry } from '@/utils/types';
import { jsPDF } from 'jspdf';
import { addEventsSection } from './audit/pdf/addEventsSection';
import { addFooter } from './audit/pdf';
import { generateVerificationMetadata } from './audit/hashVerification';

/**
 * Generate a downloadable audit trail report PDF with AI insights
 * Optimized to prevent UI freezing
 */
export const generateAuditReport = async (
  documentName: string,
  auditEvents: AuditEvent[],
  industry?: Industry
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Generating audit report for ${documentName} with ${auditEvents.length} events`);
      console.log(`Industry for audit report: ${industry || 'not specified'}`);
      
      // Generate the PDF asynchronously then resolve
      generatePDFReport(documentName, auditEvents, industry)
        .then(pdfBlob => resolve(pdfBlob))
        .catch(err => reject(err));
    } catch (error) {
      console.error('Error generating PDF report:', error);
      reject(error);
    }
  });
};

/**
 * Generate a downloadable audit logs PDF (without AI insights, just the logs)
 * Optimized for better performance with batched processing
 */
export const generateAuditLogsPDF = async (
  documentName: string,
  auditEvents: AuditEvent[]
): Promise<Blob> => {
  // Wrap in a promise to prevent UI blocking and optimize memory usage
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        console.log(`Generating audit logs PDF for ${documentName} with ${auditEvents.length} events`);
        
        // Generate integrity verification metadata
        const verificationMetadata = await generateVerificationMetadata(auditEvents);
        console.log(`[auditLogsPDF] Generated verification hash: ${verificationMetadata.shortHash}`);
        
        // Create PDF document with optimized settings
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true,
          putOnlyUsedFonts: true, // Memory optimization
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
        
        // Add verification identifier
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Verification ID: ${verificationMetadata.shortHash}`, 20, 45);
        
        // Add horizontal line
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.line(20, 48, 190, 48);
        
        // Optimized approach: limit number of events to avoid memory issues
        // Take only the most recent events if we have too many
        const maxEvents = 100; // Limit total events to avoid memory issues
        const limitedEvents = auditEvents.length > maxEvents 
          ? auditEvents.slice(0, maxEvents) 
          : auditEvents;
        
        // Process all events in a single batch instead of multiple small batches
        let yPos = 55;
        yPos = addEventsSection(pdf, limitedEvents, yPos);
        
        // Add footer with verification metadata
        addFooter(pdf, verificationMetadata);
        
        // Generate PDF blob and resolve
        const pdfBlob = pdf.output('blob');
        resolve(pdfBlob);
      } catch (error) {
        console.error('Error generating audit logs PDF:', error);
        reject(error);
      }
    }, 10);
  });
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
