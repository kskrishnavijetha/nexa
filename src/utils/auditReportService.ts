
import { AuditEvent } from '@/components/audit/types';
import { generatePDFReport, getAuditReportFileName as getFileName } from './audit';
import { Industry } from '@/utils/types';
import { jsPDF } from 'jspdf';
import { addEventsSection } from './audit/pdf/addEventsSection';
import { addFooter } from './audit/pdf';
import { generateVerificationMetadata } from './audit/hashVerification';

/**
 * Generate a downloadable audit trail report PDF with AI insights
 */
export const generateAuditReport = async (
  documentName: string,
  auditEvents: AuditEvent[],
  industry?: Industry
): Promise<Blob> => {
  // Return a promise that resolves immediately with a deferred task
  return new Promise((resolve, reject) => {
    // Use setTimeout to move heavy processing off the main thread
    setTimeout(() => {
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
    }, 0);
  });
};

/**
 * Generate a downloadable audit logs PDF (without AI insights, just the logs)
 * Optimized for better performance
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
        
        // Generate integrity verification metadata with document name
        const verificationMetadata = await generateVerificationMetadata(auditEvents);
        verificationMetadata.documentName = documentName; // Add document name to metadata
        console.log(`[auditLogsPDF] Generated verification hash: ${verificationMetadata.shortHash}`);
        
        // Create PDF document with optimized settings
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true,
          putOnlyUsedFonts: true, // Memory optimization
        });
        
        // The header with document name and verification details is now added by the addFooter function
        // so we start content from a lower Y position to avoid overlap
        
        // Add events section - process events in batches for better memory usage
        const batchSize = 50;
        const eventBatches = [];
        for (let i = 0; i < auditEvents.length; i += batchSize) {
          eventBatches.push(auditEvents.slice(i, i + batchSize));
        }
        
        // Start content after the header (give enough space for the header)
        let yPos = 90; // Position after header section
        eventBatches.forEach(batch => {
          yPos = addEventsSection(pdf, batch, yPos);
        });
        
        // Add footer with page numbers and verification information
        addFooter(pdf, verificationMetadata);
        
        // Finalize and return
        const pdfBlob = pdf.output('blob');
        resolve(pdfBlob);
      } catch (error) {
        console.error('Error generating audit logs PDF:', error);
        reject(error);
      }
    }, 0);
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
