
import { jsPDF } from "jspdf";
import { AuditEvent } from '@/components/audit/types';

/**
 * Add audit events section to the PDF document
 */
export const addEventsSection = (
  doc: jsPDF, 
  auditEvents: AuditEvent[], 
  startY: number
): number => {
  let yPos = startY;
  
  // Add section header
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text('Audit Events Log', 20, yPos);
  yPos += 10;
  
  // Add description
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Complete log of all recorded audit events in chronological order:', 25, yPos);
  yPos += 7;
  
  // Add event entries with pagination awareness
  const eventsPerPage = 8; // Limit events per page to avoid overflow
  
  // Get most recent events first and limit to a reasonable number
  const recentEvents = [...auditEvents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 30); // Limit to 30 most recent events
  
  for (let i = 0; i < recentEvents.length; i++) {
    const event = recentEvents[i];
    
    // Check if we need a new page
    if (i > 0 && i % eventsPerPage === 0) {
      doc.addPage();
      yPos = 20;
      
      // Repeat section header on new page
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text('Audit Events Log (Continued)', 20, yPos);
      yPos += 10;
    }
    
    // Format date
    const eventDate = new Date(event.timestamp).toLocaleString();
    
    // Add event entry - Using 'action' instead of 'eventType'
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${i + 1}. ${eventDate} - ${event.action}`, 25, yPos);
    yPos += 6;
    
    // Add event description - Since there's no direct 'description' property, we'll use action as a fallback
    // or create a descriptive text from other properties
    doc.setFont('helvetica', 'normal');
    let description = '';
    
    // Check if there's a documentName to include
    if (event.documentName) {
      description = `Document: ${event.documentName}`;
      if (event.status) {
        description += ` - Status: ${event.status}`;
      }
    } else {
      description = event.action; // Use action as fallback description
    }
    
    if (description.length > 100) {
      description = description.substring(0, 97) + '...';
    }
    
    const descriptionLines = doc.splitTextToSize(description, 160);
    doc.text(descriptionLines, 30, yPos);
    
    // Adjust yPos based on number of lines
    yPos += Math.max(6, descriptionLines.length * 5);
    
    // Add user info if available
    if (event.user) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text(`User: ${event.user}`, 30, yPos);
      yPos += 6;
    }
    
    // Add separator except for last item
    if (i < recentEvents.length - 1) {
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.1);
      doc.line(25, yPos, 185, yPos);
      yPos += 6;
    }
  }
  
  yPos += 10;
  
  return yPos;
};
