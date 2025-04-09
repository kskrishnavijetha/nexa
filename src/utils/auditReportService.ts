
import { jsPDF } from 'jspdf';
import { AuditEvent } from '@/components/audit/types';
import { Industry } from '@/utils/types';
import { generatePDFReport } from './audit/pdfGenerator';
import { getAuditReportFileName as getFileName } from './audit/fileUtils';
import { mapToIndustryType } from './audit/industryUtils';

/**
 * Generate a PDF report for the audit trail with improved performance
 */
export const generateAuditReport = async (
  documentName: string, 
  auditEvents: AuditEvent[], 
  industry?: Industry,
  verificationMetadata?: any
): Promise<Blob> => {
  try {
    console.log(`[auditReportService] Generating optimized report for ${documentName} with ${auditEvents.length} events`);
    
    // Limit number of events processed for better performance if there are too many
    const optimizedEvents = auditEvents.length > 500 
      ? auditEvents.slice(0, 500) // Only use the most recent 500 events
      : auditEvents;
      
    if (auditEvents.length > 500) {
      console.log(`[auditReportService] Limited events from ${auditEvents.length} to 500 for better performance`);
    }
    
    // Map the industry string to Industry type if provided
    const mappedIndustry = industry ? mapToIndustryType(industry) : undefined;
    
    // Generate the PDF report with verification metadata and optimized events
    const pdf = await generatePDFReport(documentName, optimizedEvents, mappedIndustry, verificationMetadata);
    
    // Create blob with optimal compression settings
    return new Blob([pdf.output('arraybuffer')], { 
      type: 'application/pdf'
    });
  } catch (error) {
    console.error('[auditReportService] Error generating audit report:', error);
    throw new Error('Failed to generate audit report PDF');
  }
};

/**
 * Generate a PDF with the raw audit logs - with performance optimizations
 */
export const generateAuditLogsPDF = async (
  documentName: string, 
  auditEvents: AuditEvent[],
  verificationMetadata?: any
): Promise<Blob> => {
  try {
    // Create PDF document with optimal settings
    const doc = new jsPDF({
      compress: true,
      putOnlyUsedFonts: true,
      precision: 2
    });
    
    const pageHeight = doc.internal.pageSize.height;
    
    // Title
    doc.setFontSize(18);
    doc.text(`Audit Logs: ${documentName}`, 20, 20);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Sort events by timestamp but limit the total events to improve performance
    // Reduced max events for better performance
    const maxEvents = 200; // Reduced from 500 to 200 for much faster generation
    const sortedEvents = [...auditEvents]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(0, maxEvents);
    
    // Events count - show how many were included vs total
    doc.text(`Events included: ${sortedEvents.length} of ${auditEvents.length} total events`, 20, 40);
    
    if (auditEvents.length > maxEvents) {
      doc.setFontSize(10);
      doc.setTextColor(255, 0, 0);
      doc.text(`Note: Displaying only ${maxEvents} of ${auditEvents.length} events for performance.`, 20, 50);
      doc.setTextColor(0, 0, 0);
    }
    
    let yPosition = 60;
    
    // Use much larger batch size for faster processing
    const batchSize = 100; // Increased from 50 to 100
    for (let i = 0; i < sortedEvents.length; i += batchSize) {
      const batch = sortedEvents.slice(i, i + batchSize);
      
      // Simplify event rendering for better performance
      for (const event of batch) {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Event header (timestamp and status)
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const date = new Date(event.timestamp).toLocaleString();
        // Simplified event format for faster rendering
        doc.text(`${date} - ${event.status || "unknown"}`, 20, yPosition);
        yPosition += 7;
        
        // Event details
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        
        // Use a shortened version of action for better performance
        const actionText = event.action?.length > 80 
          ? event.action.substring(0, 80) + '...' 
          : event.action || 'No action specified';
          
        doc.text(`Action: ${actionText}`, 25, yPosition);
        yPosition += 7;
        
        // Simplified separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition, 180, yPosition);
        yPosition += 7;
      }
    }
    
    // Add footer with verification metadata
    const { addFooter } = await import('./audit/pdf/addFooter');
    addFooter(doc, verificationMetadata);
    
    // Return optimized blob with better compression
    return new Blob([doc.output('arraybuffer')], { 
      type: 'application/pdf'
    });
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
  const sanitizedDocName = documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase().substring(0, 30); // Limit length
  
  return `audit-logs-${sanitizedDocName}-${formattedDate}.pdf`;
};
