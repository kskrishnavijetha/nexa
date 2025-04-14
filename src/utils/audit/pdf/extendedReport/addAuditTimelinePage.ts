
import { jsPDF } from 'jspdf';
import { formatTimestamp } from '@/components/audit/auditUtils';

/**
 * Add audit timeline page to the extended audit report
 */
export const addAuditTimelinePage = (
  doc: jsPDF,
  auditEvents: any[],
  documentName: string
) => {
  // Set page properties
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add page header
  doc.setFillColor(25, 65, 120);
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Audit Timeline / Event Log', pageWidth / 2, 13, { align: 'center' });
  
  // Add section description
  let yPos = 30;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const descriptionText = `This timeline provides a chronological record of all audit events, user actions, and system detections related to document "${documentName}".`;
  
  const descriptionLines = doc.splitTextToSize(descriptionText, pageWidth - 40);
  doc.text(descriptionLines, 20, yPos);
  
  // Update position based on number of lines
  yPos += descriptionLines.length * 6 + 10;
  
  // Sort events by timestamp (most recent first)
  const sortedEvents = [...auditEvents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Add timeline section
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const startX = 25;
  const timelineX = 45;
  const eventWidth = pageWidth - timelineX - 15;
  
  // Add timeline vertical line
  doc.setDrawColor(200, 220, 240);
  doc.setLineWidth(1);
  doc.line(timelineX, yPos, timelineX, Math.min(yPos + sortedEvents.length * 20, pageHeight - 30));
  
  // Add events to timeline
  sortedEvents.forEach((event, index) => {
    // Check if we need a new page
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 30;
      
      // Add continuation header
      doc.setFillColor(25, 65, 120);
      doc.rect(0, 0, pageWidth, 20, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('Audit Timeline / Event Log (Continued)', pageWidth / 2, 13, { align: 'center' });
      
      // Continue timeline line
      doc.setDrawColor(200, 220, 240);
      doc.setLineWidth(1);
      doc.line(timelineX, yPos, timelineX, Math.min(yPos + (sortedEvents.length - index) * 20, pageHeight - 30));
    }
    
    // Format timestamp
    const formattedTimestamp = formatTimestamp(event.timestamp);
    
    // Add timestamp
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(formattedTimestamp, startX, yPos + 4, { align: 'right' });
    
    // Add timeline node
    doc.setFillColor(25, 65, 120);
    doc.circle(timelineX, yPos, 3, 'F');
    
    // Add event action
    doc.setFontSize(10);
    doc.setTextColor(25, 65, 120);
    doc.setFont('helvetica', 'bold');
    doc.text(event.action, timelineX + 8, yPos + 4);
    
    // Add event details
    let extraLines = 0;
    if (event.status) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      
      // Set status color
      const statusColor = event.status === 'completed' 
        ? [0, 128, 0] 
        : event.status === 'in-progress' 
          ? [0, 100, 200] 
          : [230, 150, 0];
      
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.text(`Status: ${event.status}`, timelineX + 8, yPos + 12);
      extraLines = 1;
    }
    
    // Add user info if available
    if (event.user && event.user !== 'System') {
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`User: ${event.user}`, timelineX + 60, yPos + 12);
    }
    
    // Add comments if available
    if (event.comments && event.comments.length > 0) {
      const comment = event.comments[0];
      if (comment && comment.length > 0) {
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        const commentLines = doc.splitTextToSize(comment, eventWidth - 10);
        doc.text(commentLines, timelineX + 8, yPos + 12 + (extraLines * 8));
        extraLines += commentLines.length;
      }
    }
    
    // Update position for next event
    yPos += 12 + (extraLines * 8) + 8;
  });
  
  // Add page number
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Page 4',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
};
