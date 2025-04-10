
import { jsPDF } from "jspdf";
import { AuditEvent } from '@/components/audit/types';

/**
 * Add audit events section to the PDF document
 * Improved memory management and pagination
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
  
  // Optimize: Even fewer events per page to avoid rendering issues
  const eventsPerPage = 5; // Reduced from 6 to prevent rendering issues
  
  // Get most recent events first and limit to a reasonable number
  // Clone the array to avoid modifying the original
  const sortedEvents = [...auditEvents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Limit to even fewer events for better performance and reliability
  const recentEvents = sortedEvents.slice(0, 20); 
  
  // Process one event at a time to avoid browser freezing
  for (let i = 0; i < recentEvents.length; i++) {
    const event = recentEvents[i];
    
    // Check if we need a new page - do this BEFORE adding content to avoid overflow
    if (i > 0 && i % eventsPerPage === 0) {
      doc.addPage();
      yPos = 20;
      
      // Repeat section header on new page
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text('Audit Events Log (Continued)', 20, yPos);
      yPos += 10;
    }
    
    // Format date - handle potential date parsing issues
    let eventDate;
    try {
      eventDate = new Date(event.timestamp).toLocaleString();
    } catch (e) {
      eventDate = "Unknown date";
      console.warn("Error formatting date:", e);
    }
    
    // Add event entry - Using 'action' instead of 'eventType'
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${i + 1}. ${eventDate} - ${event.action}`, 25, yPos);
    yPos += 6;
    
    // Add event description with more stringent length limit
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
    
    // Further limit description length to prevent rendering issues
    if (description.length > 80) {
      description = description.substring(0, 77) + '...';
    }
    
    const descriptionLines = doc.splitTextToSize(description, 155); // Reduced width
    doc.text(descriptionLines, 30, yPos);
    
    // Adjust yPos based on number of lines (with maximum cap)
    const lineCount = Math.min(descriptionLines.length, 3); // Limit to 3 lines max
    yPos += Math.max(6, lineCount * 5);
    
    // Add user info if available (with length limit)
    if (event.user) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const userText = event.user.length > 25 ? event.user.substring(0, 22) + '...' : event.user;
      doc.text(`User: ${userText}`, 30, yPos);
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
