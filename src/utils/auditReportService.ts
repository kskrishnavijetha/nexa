
import { AuditEvent } from '@/components/audit/types';
import jsPDF from 'jspdf';

/**
 * Generate a downloadable audit trail report PDF
 */
export const generateAuditReport = async (
  documentName: string,
  auditEvents: AuditEvent[]
): Promise<Blob> => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set font size and styles
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  
  // Add title
  doc.text('Audit Trail Report', 20, 20);
  
  // Add document name and date
  doc.setFontSize(14);
  doc.text(`Document: ${documentName}`, 20, 30);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 40);
  
  // Add horizontal line
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);
  
  // Set normal font for content
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  let yPos = 55;
  
  // Sort events by timestamp in descending order
  const sortedEvents = [...auditEvents].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Add each audit event
  sortedEvents.forEach((event, index) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    // Add event details
    const timestamp = new Date(event.timestamp).toLocaleString();
    
    // Set color based on event type (assuming event.eventType exists)
    const eventType = event.eventType || 'default';
    if (eventType === 'system') {
      doc.setTextColor(0, 102, 204);
    } else if (eventType === 'user') {
      doc.setTextColor(0, 153, 51);
    } else {
      doc.setTextColor(0, 0, 0);
    }
    
    doc.setFontSize(12);
    doc.text(`Event #${index + 1}: ${eventType.toUpperCase()}`, 20, yPos);
    yPos += 7;
    
    // Reset color
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    doc.text(`Time: ${timestamp}`, 25, yPos);
    yPos += 7;
    
    doc.text(`User: ${event.user || 'System'}`, 25, yPos);
    yPos += 7;
    
    // Add message with word wrapping
    const eventMessage = event.text || '';
    const messageLines = doc.splitTextToSize(`Message: ${eventMessage}`, 160);
    doc.text(messageLines, 25, yPos);
    yPos += (messageLines.length * 5) + 2;
    
    // Add status if available
    if (event.status) {
      doc.text(`Status: ${event.status}`, 25, yPos);
      yPos += 7;
    }
    
    // Add comments if available
    if (event.comments && event.comments.length > 0) {
      doc.text('Comments:', 25, yPos);
      yPos += 7;
      
      event.comments.forEach(comment => {
        const commentLines = doc.splitTextToSize(`- ${comment.text} (${comment.user}, ${new Date(comment.timestamp).toLocaleString()})`, 155);
        doc.text(commentLines, 30, yPos);
        yPos += (commentLines.length * 5) + 2;
      });
    }
    
    // Add separator unless it's the last event
    if (index < sortedEvents.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
    }
  });
  
  // Generate the PDF as a blob
  return doc.output('blob');
};

export const getAuditReportFileName = (documentName: string): string => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const sanitizedDocName = documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  return `audit-report-${sanitizedDocName}-${formattedDate}.pdf`;
};
