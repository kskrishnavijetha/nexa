
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { AuditEvent } from '@/components/audit/types';
import { calculateReportStatistics } from './reportStatistics';
import { addExecutiveSummary } from './pdf/addExecutiveSummary';
import { addStatisticsSection } from './pdf/sections/addStatisticsSection';
import { addFooter } from './pdf/addFooter';

export type ExportFormat = 'json' | 'csv' | 'pdf';

/**
 * Export audit logs in the specified format
 */
export const exportAuditLogs = (
  events: AuditEvent[], 
  documentName: string, 
  format: ExportFormat
): void => {
  const fileName = generateExportFileName(documentName, format);
  
  switch (format) {
    case 'json':
      exportAsJSON(events, fileName);
      break;
    case 'csv':
      exportAsCSV(events, fileName);
      break;
    case 'pdf':
      exportAsPDF(events, documentName, fileName);
      break;
  }
};

/**
 * Generate standardized filename for exports
 */
const generateExportFileName = (documentName: string, format: ExportFormat): string => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const sanitizedDocName = documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  return `audit-logs-${sanitizedDocName}-${formattedDate}.${format}`;
};

/**
 * Export audit events as JSON file
 */
const exportAsJSON = (events: AuditEvent[], fileName: string): void => {
  const jsonData = JSON.stringify(events, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  saveAs(blob, fileName);
};

/**
 * Export audit events as CSV file
 */
const exportAsCSV = (events: AuditEvent[], fileName: string): void => {
  // Define CSV headers
  let csvContent = 'ID,Timestamp,Action,User,Status,Document\n';
  
  // Add each event as a CSV row
  events.forEach(event => {
    // Sanitize fields to handle commas and quotes
    const sanitizedAction = event.action.replace(/"/g, '""');
    
    csvContent += `"${event.id}","${event.timestamp}","${sanitizedAction}","${event.user}","${event.status}","${event.documentName}"\n`;
  });
  
  // Create and save the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
};

/**
 * Export audit events as PDF report
 */
const exportAsPDF = (events: AuditEvent[], documentName: string, fileName: string): void => {
  // Create PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Add title
  pdf.setFontSize(22);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Audit Logs Export', 20, 20);
  
  // Add document info
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Document: ${documentName}`, 20, 35);
  pdf.text(`Export Date: ${new Date().toLocaleDateString()}`, 20, 42);
  
  // Add report stats
  const stats = calculateReportStatistics(events);
  let yPos = addStatisticsSection(pdf, stats, 55);
  
  // Add events table
  yPos = addEventsTable(pdf, events, yPos);
  
  // Add footer
  addFooter(pdf);
  
  // Save the PDF
  pdf.save(fileName);
};

/**
 * Add events table to PDF
 */
const addEventsTable = (pdf: jsPDF, events: AuditEvent[], startY: number): number => {
  // Table header
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, startY, 170, 10, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  
  pdf.text('Timestamp', 22, startY + 7);
  pdf.text('Action', 60, startY + 7);
  pdf.text('User', 130, startY + 7);
  pdf.text('Status', 170, startY + 7);
  
  let yPos = startY + 15;
  
  // Table rows (limit to first 30 events to prevent excessive pages)
  const displayEvents = events.slice(0, 30);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  displayEvents.forEach((event, index) => {
    // Add page if needed
    if (yPos > 270) {
      pdf.addPage();
      yPos = 20;
    }
    
    // Add alternating row background
    if (index % 2 === 1) {
      pdf.setFillColor(248, 248, 248);
      pdf.rect(20, yPos - 5, 170, 10, 'F');
    }
    
    // Format timestamp
    const date = new Date(event.timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
    // Add truncated row data
    pdf.text(formattedDate, 22, yPos);
    
    // Truncate action if too long
    let action = event.action;
    if (action.length > 35) {
      action = action.substring(0, 32) + '...';
    }
    pdf.text(action, 60, yPos);
    
    pdf.text(event.user, 130, yPos);
    pdf.text(event.status, 170, yPos);
    
    yPos += 10;
  });
  
  // Show truncation message if needed
  if (events.length > 30) {
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Note: Showing only the first 30 of ${events.length} total audit events.`, 20, yPos + 5);
    yPos += 15;
  }
  
  return yPos;
};
