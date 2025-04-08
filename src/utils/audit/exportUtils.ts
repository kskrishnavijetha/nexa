
import { AuditEvent } from '@/components/audit/types';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { addFooter } from './pdf/addFooter';

export type AuditExportFormat = 'json' | 'csv' | 'pdf';

/**
 * Export audit logs in JSON format
 */
export const exportAuditLogsAsJSON = (
  documentName: string,
  auditEvents: AuditEvent[]
): void => {
  // Create a JSON blob
  const jsonData = JSON.stringify(auditEvents, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  
  // Generate filename
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const sanitizedDocName = documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  // Save file
  saveAs(blob, `audit-logs-${sanitizedDocName}-${formattedDate}.json`);
};

/**
 * Export audit logs in CSV format
 */
export const exportAuditLogsAsCSV = (
  documentName: string,
  auditEvents: AuditEvent[]
): void => {
  // CSV headers
  const headers = ['ID', 'Timestamp', 'Action', 'User', 'Status', 'Document'];
  const csvRows = [headers.join(',')];
  
  // Add row for each event
  auditEvents.forEach(event => {
    // Clean up values to ensure they don't break CSV format
    const safeAction = event.action.replace(/"/g, '""');
    const safeUser = event.user.replace(/"/g, '""');
    
    const row = [
      event.id,
      new Date(event.timestamp).toISOString(),
      `"${safeAction}"`, // Quote strings to handle commas
      `"${safeUser}"`,
      event.status,
      documentName
    ];
    
    csvRows.push(row.join(','));
  });
  
  // Create a CSV blob
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Generate filename
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const sanitizedDocName = documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  // Save file
  saveAs(blob, `audit-logs-${sanitizedDocName}-${formattedDate}.csv`);
};

/**
 * Export audit logs as a standalone PDF
 */
export const exportAuditLogsAsPDF = (
  documentName: string,
  auditEvents: AuditEvent[]
): void => {
  // Create PDF with a slightly larger page size (a4+ format)
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
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text(`Audit Logs: ${documentName}`, 20, 20);
  
  // Add timestamp
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
  
  // Add horizontal line
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.2);
  pdf.line(20, 35, 190, 35);
  
  // Add logs
  let yPos = 45;
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  // Column headers
  pdf.setFont(undefined, 'bold');
  pdf.text('Timestamp', 20, yPos);
  pdf.text('Action', 70, yPos);
  pdf.text('User', 130, yPos);
  pdf.text('Status', 175, yPos);
  pdf.setFont(undefined, 'normal');
  yPos += 10;
  
  // Sort events by timestamp (newest first)
  const sortedEvents = [...auditEvents].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Add each event as a row
  sortedEvents.forEach((event, index) => {
    // Check if we need a new page
    if (yPos > 270) {
      pdf.addPage();
      yPos = 20;
    }
    
    // Format timestamp
    const date = new Date(event.timestamp);
    const timestamp = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    
    // Add alternating row background
    if (index % 2 === 1) {
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, yPos - 5, 170, 8, 'F');
    }
    
    // Add row data
    pdf.text(timestamp, 20, yPos);
    pdf.text(truncateText(event.action, 12), 70, yPos);
    pdf.text(truncateText(event.user, 9), 130, yPos);
    
    // Status with color
    const statusColor = event.status === 'completed' 
      ? [0, 128, 0] 
      : event.status === 'in-progress' 
      ? [0, 0, 255] 
      : [128, 128, 128];
    
    pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    pdf.text(event.status, 175, yPos);
    pdf.setTextColor(0, 0, 0);
    
    yPos += 8;
  });
  
  // Add footer
  addFooter(pdf);
  
  // Save the PDF
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const sanitizedDocName = documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const fileName = `audit-logs-${sanitizedDocName}-${formattedDate}.pdf`;
  
  pdf.save(fileName);
};

// Helper function to truncate text to fit in columns
function truncateText(text: string, maxWords: number): string {
  const words = text.split(' ');
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(' ') + '...';
}

/**
 * Export audit logs in the specified format
 */
export const exportAuditLogs = (
  documentName: string,
  auditEvents: AuditEvent[],
  format: AuditExportFormat
): void => {
  switch (format) {
    case 'json':
      exportAuditLogsAsJSON(documentName, auditEvents);
      break;
    case 'csv':
      exportAuditLogsAsCSV(documentName, auditEvents);
      break;
    case 'pdf':
      exportAuditLogsAsPDF(documentName, auditEvents);
      break;
  }
};
