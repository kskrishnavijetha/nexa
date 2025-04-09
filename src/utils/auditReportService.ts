
import { jsPDF } from 'jspdf';
import { AuditEvent } from '@/components/audit/types';
import { Industry } from '@/utils/types';
import { generatePDFReport } from './audit/pdfGenerator';
import { getAuditReportFileName as getFileName } from './audit/fileUtils';
import { mapToIndustryType } from './audit/industryUtils';

/**
 * Generate a PDF report for the audit trail
 */
export const generateAuditReport = async (
  documentName: string, 
  auditEvents: AuditEvent[], 
  industry?: Industry,
  verificationMetadata?: any
): Promise<Blob> => {
  try {
    console.log(`[auditReportService] Generating report for ${documentName} with ${auditEvents.length} events`);
    
    // Map the industry string to Industry type if provided
    const mappedIndustry = industry ? mapToIndustryType(industry) : undefined;
    
    // Generate the PDF report with verification metadata
    const pdf = await generatePDFReport(documentName, auditEvents, mappedIndustry, verificationMetadata);
    
    // Return as blob with optimized compression - fixed blob output method
    return new Blob([pdf.output('arraybuffer')], { type: 'application/pdf' });
  } catch (error) {
    console.error('[auditReportService] Error generating audit report:', error);
    throw new Error('Failed to generate audit report PDF');
  }
};

/**
 * Generate a PDF with the raw audit logs
 */
export const generateAuditLogsPDF = async (
  documentName: string, 
  auditEvents: AuditEvent[],
  verificationMetadata?: any
): Promise<Blob> => {
  try {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    
    // Title
    doc.setFontSize(18);
    doc.text(`Audit Logs: ${documentName}`, 20, 20);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Events count
    doc.text(`Total events: ${auditEvents.length}`, 20, 40);
    
    // Sort events by timestamp
    const sortedEvents = [...auditEvents].sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    
    let yPosition = 60;
    
    // Batch event processing to improve performance
    const batchSize = 20;
    for (let i = 0; i < sortedEvents.length; i += batchSize) {
      const batch = sortedEvents.slice(i, i + batchSize);
      
      // Add events to PDF
      for (const event of batch) {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Event header (ID and timestamp)
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const date = new Date(event.timestamp).toLocaleString();
        doc.text(`Event ${i+1} - ${date} (${event.status})`, 20, yPosition);
        yPosition += 7;
        
        // Event details
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        
        doc.text(`Action: ${event.action}`, 25, yPosition);
        yPosition += 5;
        
        doc.text(`User: ${event.user}`, 25, yPosition);
        yPosition += 5;
        
        // Handle optional description using action as description
        if (event.action) {
          // Use action as description since no explicit description exists
          // Split action text into lines if it's long
          const descLines = doc.splitTextToSize(`Description: ${event.action}`, 170);
          for (const line of descLines) {
            doc.text(line, 25, yPosition);
            yPosition += 5;
          }
        }
        
        if (event.comments && event.comments.length > 0) {
          doc.text(`Comments: ${event.comments.length}`, 25, yPosition);
          yPosition += 5;
        }
        
        // Add separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;
      }
      
      // Give the browser a chance to update the UI by breaking up the work
      if (i + batchSize < sortedEvents.length) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    // Add footer with verification metadata
    const { addFooter } = await import('./audit/pdf/addFooter');
    addFooter(doc, verificationMetadata);
    
    // Return as blob with optimized compression - fixed blob output method
    return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
  } catch (error) {
    console.error('[auditReportService] Error generating audit logs PDF:', error);
    throw new Error('Failed to generate audit logs PDF');
  }
};

/**
 * Get a standardized filename for the audit report
 */
export const getAuditReportFileName = (documentName: string): string => {
  return getFileName(documentName);
};

/**
 * Get a standardized filename for the audit logs
 */
export const getAuditLogsFileName = (documentName: string): string => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const sanitizedDocName = documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  return `audit-logs-${sanitizedDocName}-${formattedDate}.pdf`;
};
