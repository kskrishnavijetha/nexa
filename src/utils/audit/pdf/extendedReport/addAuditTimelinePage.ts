
import { jsPDF } from 'jspdf';
import { AuditEvent } from '@/components/audit/types';

/**
 * Add the audit timeline page to the extended report
 */
export const addAuditTimelinePage = (
  doc: jsPDF,
  auditEvents: AuditEvent[]
): void => {
  // Set page title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text('Audit Timeline', 20, 20);
  
  // Add subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text('Chronological record of all document activities and compliance checks', 20, 28);
  
  // Draw separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 33, 190, 33);
  
  // Sort events by timestamp
  const sortedEvents = [...auditEvents].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Set initial position for the events list
  let y = 43;
  const lineHeight = 10;
  
  // Check if we have events
  if (sortedEvents.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('No audit events recorded for this document', 20, y);
    
    // Add page break
    doc.addPage();
    return;
  }
  
  // Function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Function to get action color
  const getActionColor = (action: string): [number, number, number] => {
    switch (action.toLowerCase()) {
      case 'upload':
      case 'create':
        return [0, 128, 0]; // Green
      case 'delete':
      case 'remove':
        return [220, 20, 20]; // Red
      case 'update':
      case 'edit':
        return [0, 102, 204]; // Blue
      case 'scan':
      case 'analyze':
        return [153, 51, 153]; // Purple
      default:
        return [80, 80, 80]; // Gray
    }
  };
  
  // Iterate through events and add them to the timeline
  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];
    const formattedDate = formatDate(event.timestamp);
    const actionColor = getActionColor(event.action);
    
    // If we're about to go off the page, add a new page
    if (y > 260) {
      doc.addPage();
      y = 20; // reset y position for new page
    }
    
    // Draw timeline dot
    doc.setFillColor(actionColor[0], actionColor[1], actionColor[2]);
    doc.circle(25, y - 1, 1.5, 'F');
    
    // Draw vertical line to connect dots
    if (i < sortedEvents.length - 1) {
      doc.setDrawColor(actionColor[0], actionColor[1], actionColor[2]);
      doc.setLineWidth(0.3);
      doc.line(25, y + 1, 25, y + lineHeight - 1);
    }
    
    // Event timestamp
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(formattedDate, 30, y);
    
    // Event action
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(actionColor[0], actionColor[1], actionColor[2]);
    
    // Capitalize the first letter of the action
    const displayAction = event.action.charAt(0).toUpperCase() + event.action.slice(1);
    doc.text(displayAction, 90, y);
    
    // Add user info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`by ${event.user}`, 140, y);
    
    // Move to next line
    y += lineHeight;
    
    // Add event details if available (using action as placeholder)
    if (event.action) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      // Use a safe way to get details, modify this based on your event structure
      const details = `Document: ${event.documentName || 'Unknown document'}`;
      doc.text(details, 30, y);
      y += lineHeight;
    }
    
    // Add extra spacing between events
    y += 2;
  }
  
  // Add page break
  doc.addPage();
};
