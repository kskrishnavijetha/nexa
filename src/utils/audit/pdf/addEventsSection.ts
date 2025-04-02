
import { jsPDF } from "jspdf";
import { AuditEvent } from '@/components/audit/types';

/**
 * Add detailed audit events section to the PDF document
 */
export const addEventsSection = (doc: jsPDF, auditEvents: AuditEvent[], startY: number): number => {
  let yPos = startY;
  
  // Add events section header
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text('Detailed Audit Events', 20, yPos);
  yPos += 10;
  
  // Add section description
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('This section lists all audit events in chronological order for detailed review.', 20, yPos);
  yPos += 10;
  
  // Sort events by timestamp, newest first
  const sortedEvents = [...auditEvents].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Group events by date
  const eventsByDate = groupEventsByDate(sortedEvents);
  
  // Render each date group
  Object.entries(eventsByDate).forEach(([date, events], index) => {
    // Check if we need a new page
    if (yPos > 250 && index > 0) {
      doc.addPage();
      yPos = 20;
    }
    
    // Add date header
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text(date, 20, yPos);
    yPos += 5;
    
    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
    
    // Add each event for this date
    events.forEach(event => {
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      // Add event time
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const time = new Date(event.timestamp).toLocaleTimeString();
      doc.text(time, 20, yPos);
      
      // Add event action with appropriate color based on status
      doc.setFontSize(10);
      if (event.status === 'completed') {
        doc.setTextColor(0, 128, 0); // Green for completed
      } else if (event.status === 'in-progress') {
        doc.setTextColor(0, 102, 204); // Blue for in-progress
      } else if (event.status === 'pending') {
        doc.setTextColor(255, 165, 0); // Orange for pending
      } else if (event.status === 'failed') {
        doc.setTextColor(204, 0, 0); // Red for failed
      } else {
        doc.setTextColor(0, 0, 0); // Black for other
      }
      
      doc.text(event.action, 50, yPos);
      
      // Add event user if available
      if (event.user) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`By: ${event.user}`, 160, yPos);
      }
      
      yPos += 7;
      
      // Add comments if available
      if (event.comments && event.comments.length > 0) {
        event.comments.forEach(comment => {
          // Check if we need a new page
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          
          // Wrap comment text
          const commentText = doc.splitTextToSize(`Comment: ${comment.text}`, 130);
          doc.text(commentText, 55, yPos);
          
          // Add comment user and time
          doc.text(`- ${comment.user} at ${new Date(comment.timestamp).toLocaleTimeString()}`, 
            190, yPos, { align: 'right' });
          
          yPos += Math.max(7, commentText.length * 4);
        });
      }
      
      yPos += 3;
    });
    
    yPos += 5;
  });
  
  return yPos;
};

/**
 * Group events by date (YYYY-MM-DD)
 */
const groupEventsByDate = (events: AuditEvent[]): Record<string, AuditEvent[]> => {
  const grouped: Record<string, AuditEvent[]> = {};
  
  events.forEach(event => {
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(event);
  });
  
  return grouped;
};
