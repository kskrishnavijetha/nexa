
import { AuditEvent } from '@/components/audit/types';
import { jsPDF } from 'jspdf';
import { getAuditReportFileName } from './fileUtils';
import { calculateReportStatistics } from './reportStatistics';
import FileSaver from 'file-saver';

/**
 * Export audit events to JSON format
 */
export const exportToJSON = (auditEvents: AuditEvent[], documentName: string): void => {
  const fileName = `${documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-audit-logs.json`;
  const jsonContent = JSON.stringify(auditEvents, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  FileSaver.saveAs(blob, fileName);
};

/**
 * Export audit events to CSV format
 */
export const exportToCSV = (auditEvents: AuditEvent[], documentName: string): void => {
  // Define CSV header
  const header = ['Timestamp', 'Action', 'User', 'Status'].join(',');
  
  // Map audit events to CSV rows
  const rows = auditEvents.map(event => {
    const timestamp = new Date(event.timestamp).toISOString();
    const action = event.action.replace(/,/g, ';'); // Replace commas to avoid CSV parsing issues
    const user = event.user.replace(/,/g, ';');
    const status = event.status || 'N/A';
    
    return [timestamp, action, user, status].join(',');
  });
  
  // Combine header and rows
  const csvContent = [header, ...rows].join('\n');
  
  // Create and download file
  const fileName = `${documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-audit-logs.csv`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  FileSaver.saveAs(blob, fileName);
};

/**
 * Export audit events to a simple PDF format
 * This is a simplified version that just lists the events
 */
export const exportToPDF = (auditEvents: AuditEvent[], documentName: string): void => {
  // Create PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set document properties
  pdf.setProperties({
    title: `Audit Log - ${documentName}`,
    subject: 'Audit Trail Logs',
    creator: 'Audit Trail System'
  });
  
  // Add title
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text(`Audit Logs - ${documentName}`, 20, 20);
  
  // Add timestamp
  const currentDate = new Date().toLocaleDateString();
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on: ${currentDate}`, 20, 28);
  
  // Add table header
  let yPos = 40;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Timestamp', 20, yPos);
  pdf.text('Action', 60, yPos);
  pdf.text('User', 130, yPos);
  pdf.text('Status', 180, yPos);
  
  // Draw header line
  yPos += 2;
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.2);
  pdf.line(20, yPos, 190, yPos);
  
  // Add events
  pdf.setFont('helvetica', 'normal');
  auditEvents.forEach((event, index) => {
    yPos += 8;
    
    // Add a new page if needed
    if (yPos > 280) {
      pdf.addPage();
      yPos = 20;
    }
    
    // Format date
    const timestamp = new Date(event.timestamp).toLocaleString();
    
    // Limit action text length to fit in column
    let action = event.action;
    if (action.length > 30) {
      action = action.substring(0, 27) + '...';
    }
    
    // Add row data
    pdf.setFontSize(10);
    pdf.text(timestamp, 20, yPos);
    pdf.text(action, 60, yPos);
    pdf.text(event.user, 130, yPos);
    pdf.text(event.status || 'N/A', 180, yPos);
  });
  
  // Save the PDF file
  const fileName = getAuditReportFileName(documentName).replace('ai-enhanced-audit', 'audit-log');
  pdf.save(fileName);
};

