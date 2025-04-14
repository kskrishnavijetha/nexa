
import { jsPDF } from 'jspdf';
import { AuditEvent } from '@/components/audit/types';
import { formatTimestamp } from '@/components/audit/auditUtils';

/**
 * Add audit timeline page to the extended report
 */
export const addAuditTimelinePage = (
  doc: jsPDF,
  auditEvents: AuditEvent[]
): void => {
  // Page margin
  const margin = 20;
  let yPos = margin;
  
  // Add section title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text('Audit Trail Timeline', margin, yPos);
  yPos += 10;
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, 210 - margin, yPos);
  yPos += 10;
  
  // Add description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`This timeline shows all ${auditEvents.length} audit events captured during document analysis.`, margin, yPos);
  yPos += 10;
  
  // If no events, show a message
  if (auditEvents.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No audit events available.', margin, yPos);
    doc.addPage(); // Still add a page break
    return;
  }
  
  // Group events by date
  const eventsByDate: Record<string, AuditEvent[]> = {};
  auditEvents.forEach(event => {
    const date = new Date(event.timestamp).toDateString();
    if (!eventsByDate[date]) {
      eventsByDate[date] = [];
    }
    eventsByDate[date].push(event);
  });
  
  // Sort dates in reverse chronological order
  const sortedDates = Object.keys(eventsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  // Draw events grouped by date
  for (const date of sortedDates) {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = margin;
    }
    
    // Draw date header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text(date, margin, yPos);
    yPos += 6;
    
    // Draw events for this date
    const events = eventsByDate[date];
    for (const event of events) {
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = margin;
      }
      
      // Draw time
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(formatTimestamp(event.timestamp, true).split(' ')[1], margin, yPos);
      
      // Draw status badge
      let statusText = '';
      let statusColor: number[] = [0, 0, 0];
      
      switch (event.status) {
        case 'completed':
          statusText = 'Completed';
          statusColor = [0, 128, 0]; // Green
          break;
        case 'pending':
          statusText = 'Pending';
          statusColor = [255, 165, 0]; // Orange
          break;
        case 'in-progress':
          statusText = 'In Progress';
          statusColor = [0, 102, 204]; // Blue
          break;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.text(statusText, margin + 30, yPos);
      
      // Draw action title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(event.action, margin + 65, yPos);
      yPos += 5;
      
      // Draw user info
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`By: ${event.user}`, margin + 65, yPos);
      yPos += 5;
      
      // Draw comment if available
      if (event.comments && event.comments.length > 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        const commentText = event.comments[0].text;
        const commentLines = doc.splitTextToSize(commentText, 105);
        doc.text(commentLines, margin + 65, yPos);
        yPos += commentLines.length * 3.5;
      }
      
      // Add space between events
      yPos += 5;
      
      // Draw light separator
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.1);
      doc.line(margin + 65, yPos, 190, yPos);
      yPos += 5;
    }
    
    // Add space between dates
    yPos += 5;
  }
  
  // Add page break
  doc.addPage();
};
