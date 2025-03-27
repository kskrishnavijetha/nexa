
import { jsPDF } from "jspdf";
import { AuditEvent } from '@/components/audit/types';

/**
 * Add detailed description for each audit event type
 */
export const getEventTypeDescription = (action: string, user: string): string => {
  // System events
  if (user === 'System') {
    if (action.includes('scan')) {
      return 'Automated compliance scan performed by the system to detect potential issues and verify regulatory adherence.';
    }
    if (action.includes('monitor')) {
      return 'Real-time monitoring activity that continuously checks for compliance violations and suspicious activities.';
    }
    if (action.includes('generat')) {
      return 'AI-assisted content generation for compliance documentation or remediation suggestions.';
    }
    if (action.includes('upload')) {
      return 'Document was uploaded to the compliance system for analysis and tracking.';
    }
    return 'Automated system action performed as part of the compliance workflow.';
  }
  
  // User events
  if (action.includes('review')) {
    return 'Manual document review performed by a compliance officer or authorized personnel.';
  }
  if (action.includes('check')) {
    return 'Specific compliance verification against regulatory requirements or internal policies.';
  }
  if (action.includes('approv')) {
    return 'Formal approval of document content or compliance status by authorized personnel.';
  }
  if (action.includes('export')) {
    return 'Data or document export operation for reporting or external sharing purposes.';
  }
  if (action.includes('remediat')) {
    return 'Actions taken to address identified compliance issues or policy violations.';
  }
  
  // Default description
  return 'Manual action performed as part of the document compliance lifecycle.';
};

/**
 * Add audit events details section to the PDF document with enhanced descriptions
 */
export const addEventsSection = (doc: jsPDF, auditEvents: AuditEvent[], startY: number): number => {
  let yPos = startY;
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Event details heading
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Detailed Audit Events', 20, yPos);
  yPos += 10;
  
  // Sort events by timestamp in descending order (newest first)
  const sortedEvents = [...auditEvents].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Add each audit event with enhanced descriptions
  sortedEvents.forEach((event, index) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Format timestamp
    const timestamp = new Date(event.timestamp).toLocaleString();
    
    // Set color based on event type 
    if (event.user === 'System') {
      doc.setTextColor(0, 102, 204); // Blue for system events
    } else {
      doc.setTextColor(0, 153, 51); // Green for user events
    }
    
    // Event number and type
    doc.setFontSize(12);
    doc.text(`Event #${index + 1} - ${event.user === 'System' ? 'System Action' : 'User Action'}`, 20, yPos);
    yPos += 7;
    
    // Reset color for details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    // Event details
    doc.text(`Timestamp: ${timestamp}`, 25, yPos);
    yPos += 7;
    
    doc.text(`User: ${event.user}`, 25, yPos);
    yPos += 7;
    
    // Action with word wrapping
    const actionLines = doc.splitTextToSize(`Action: ${event.action}`, 160);
    doc.text(actionLines, 25, yPos);
    yPos += (actionLines.length * 5) + 2;
    
    // Status
    if (event.status) {
      doc.text(`Status: ${event.status}`, 25, yPos);
      yPos += 7;
    }
    
    // Add enhanced description
    const description = getEventTypeDescription(event.action, event.user);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const descriptionLines = doc.splitTextToSize(`Description: ${description}`, 155);
    doc.text(descriptionLines, 30, yPos);
    yPos += (descriptionLines.length * 5) + 5;
    
    // Add impact and compliance context if available
    if (event.action.includes('compliance') || event.action.includes('scan') || 
        event.action.includes('check') || event.action.includes('review')) {
      doc.setFontSize(9);
      doc.setTextColor(0, 102, 153);
      const impactText = "Compliance Impact: This action directly affects the document's compliance status and may require follow-up actions.";
      const impactLines = doc.splitTextToSize(impactText, 155);
      doc.text(impactLines, 30, yPos);
      yPos += (impactLines.length * 5) + 5;
    }
    
    // Add separator unless it's the last event
    if (index < sortedEvents.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
    }
  });
  
  return yPos;
};
