
import { jsPDF } from 'jspdf';
import { ExportOptions } from './types';
import { getFormattedDate, getSanitizedFileName } from './utils';
import { addFooter } from '../pdf/addFooter';

/**
 * Export audit logs as a standalone PDF
 */
export const exportAuditLogsAsPDF = (
  { documentName, auditEvents }: ExportOptions
): void => {
  // Create PDF with a slightly larger page size (a4 format)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true
  });
  
  // Set properties
  pdf.setProperties({
    title: `Audit Logs - ${documentName}`,
    subject: 'Audit Logs Export',
    creator: 'Audit Log Export Tool'
  });
  
  // Add title
  pdf.setFontSize(24);
  pdf.setTextColor(0, 51, 102);
  pdf.text(`Audit Logs Report`, 20, 20);
  
  // Add document name
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Document: ${documentName}`, 20, 35);
  
  // Add timestamp
  const currentDate = new Date();
  const formattedDateTime = `${currentDate.toLocaleDateString()} at ${currentDate.toLocaleTimeString()}`;
  pdf.setFontSize(11);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on: ${formattedDateTime}`, 20, 45);
  
  // Add total events count
  pdf.text(`Total events: ${auditEvents.length}`, 20, 53);
  
  // Add horizontal line
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.2);
  pdf.line(20, 60, 190, 60);
  
  // Add Audit Events Log header
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Audit Events Log', 20, 70);
  
  // Add description
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Complete log of all recorded audit events in chronological order:', 20, 80);
  
  // Sort events by timestamp (newest first)
  const sortedEvents = [...auditEvents].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Add each event as a section
  let yPos = 90;
  sortedEvents.forEach((event, index) => {
    // Check if we need a new page
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    
    // Format timestamp
    const date = new Date(event.timestamp);
    const timestamp = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
    
    // Event number and timestamp
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${timestamp} - ${event.action}`, 20, yPos);
    yPos += 7;
    
    // Document name and status
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Document: ${documentName} - Status: ${event.status || 'N/A'}`, 25, yPos);
    yPos += 7;
    
    // User info
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`User: ${event.user}`, 25, yPos);
    yPos += 12;
    
    // Add separator except for last item
    if (index < sortedEvents.length - 1) {
      pdf.setDrawColor(230, 230, 230);
      pdf.setLineWidth(0.1);
      pdf.line(20, yPos - 6, 190, yPos - 6);
    }
  });
  
  // Add footer with page numbers
  addFooter(pdf);
  
  // Save the PDF
  const formattedDate = getFormattedDate();
  const sanitizedDocName = getSanitizedFileName(documentName);
  const fileName = `audit-logs-${sanitizedDocName}-${formattedDate}.pdf`;
  
  pdf.save(fileName);
};
