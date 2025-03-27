
import { jsPDF } from "jspdf";
import { AuditEvent } from '@/components/audit/types';

/**
 * Add a detailed executive summary section to the PDF
 */
export const addExecutiveSummary = (doc: jsPDF, auditEvents: AuditEvent[], documentName: string): number => {
  let yPos = 45;
  
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text('Executive Summary', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Calculate some metrics for the summary
  const totalEvents = auditEvents.length;
  const systemEvents = auditEvents.filter(e => e.user === 'System').length;
  const userEvents = totalEvents - systemEvents;
  const completedEvents = auditEvents.filter(e => e.status === 'completed').length;
  const inProgressEvents = auditEvents.filter(e => e.status === 'in-progress').length;
  
  // Create executive summary text
  const summaryText = 
    `This report documents the complete audit trail for "${documentName}" with a total of ${totalEvents} recorded events. ` +
    `The document has undergone ${systemEvents} automated system checks and ${userEvents} manual user interactions. ` +
    `Currently, ${completedEvents} events have been completed successfully, with ${inProgressEvents} still in progress. ` +
    `This audit trail provides a complete chronological record of all activities, modifications, and compliance checks performed on the document, ` +
    `ensuring full accountability and transparency in compliance management.`;
  
  const summaryLines = doc.splitTextToSize(summaryText, 170);
  doc.text(summaryLines, 20, yPos);
  
  yPos += (summaryLines.length * 5) + 10;
  return yPos;
};
