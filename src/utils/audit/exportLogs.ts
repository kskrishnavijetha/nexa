
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { AuditEvent } from '@/components/audit/types';
import { calculateReportStatistics } from './reportStatistics';
import { addExecutiveSummary } from './pdf/addExecutiveSummary';
import { addStatisticsSection } from './pdf/sections/addStatisticsSection';
import { addFooter } from './pdf/addFooter';
import { generateChainHash } from './logIntegrity';

export type ExportFormat = 'json' | 'csv' | 'pdf';

/**
 * Export audit logs in the specified format
 */
export const exportAuditLogs = async (
  events: AuditEvent[], 
  documentName: string, 
  format: ExportFormat
): Promise<void> => {
  const fileName = generateExportFileName(documentName, format);
  
  switch (format) {
    case 'json':
      await exportAsJSON(events, fileName);
      break;
    case 'csv':
      exportAsCSV(events, fileName);
      break;
    case 'pdf':
      await exportAsPDF(events, documentName, fileName);
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
 * Export audit events as PDF report with integrity verification
 */
const exportAsPDF = async (events: AuditEvent[], documentName: string, fileName: string): Promise<void> => {
  // Create PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Generate integrity hash for the events
  const integrityHash = await generateChainHash(events);
  
  // Add title
  pdf.setFontSize(22);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Audit Logs Export', 20, 20);
  
  // Add document info
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Document: ${documentName}`, 20, 35);
  pdf.text(`Export Date: ${new Date().toLocaleDateString()}`, 20, 42);
  
  // Add integrity verification section
  pdf.setFontSize(12);
  pdf.setTextColor(0, 102, 0);
  pdf.text('Integrity Verification', 20, 50);
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Hash: ${integrityHash.substring(0, 32)}...`, 20, 57);
  pdf.text(`Timestamp: ${new Date().toISOString()}`, 20, 64);
  
  // Add report stats
  const stats = calculateReportStatistics(events);
  let yPos = addStatisticsSection(pdf, stats, 75);
  
  // Add events table
  yPos = addEventsTable(pdf, events, yPos);
  
  // Add footer with integrity hash
  addFooter(pdf, integrityHash);
  
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
  
  // Table rows - handle pagination appropriately
  const rowHeight = 10;
  const maxYPosition = 250; // Leave space for footer
  
  // Sort by timestamp (newest first) for better readability
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  sortedEvents.forEach((event, index) => {
    // Check if we need a new page
    if (yPos + rowHeight > maxYPosition) {
      pdf.addPage();
      
      // Reset position and redraw header
      yPos = 20;
      
      // Table header on new page
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, yPos, 170, 10, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      
      pdf.text('Timestamp', 22, yPos + 7);
      pdf.text('Action', 60, yPos + 7);
      pdf.text('User', 130, yPos + 7);
      pdf.text('Status', 170, yPos + 7);
      
      yPos += 15;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
    }
    
    // Add alternating row background
    if (index % 2 === 1) {
      pdf.setFillColor(248, 248, 248);
      pdf.rect(20, yPos - 5, 170, 10, 'F');
    }
    
    // Format timestamp
    const date = new Date(event.timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
    // Add row data with proper truncation
    pdf.text(formattedDate, 22, yPos);
    
    // Truncate action if too long
    let action = event.action;
    if (action.length > 35) {
      action = action.substring(0, 32) + '...';
    }
    pdf.text(action, 60, yPos);
    
    // Truncate user if needed
    let user = event.user || 'System';
    if (user.length > 20) {
      user = user.substring(0, 17) + '...';
    }
    pdf.text(user, 130, yPos);
    
    pdf.text(event.status || 'N/A', 170, yPos);
    
    yPos += rowHeight;
  });
  
  return yPos + 10; // Add some padding at the end
};
