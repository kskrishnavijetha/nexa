
import { saveAs } from 'file-saver';
import { ExportOptions } from './types';
import { getFormattedDate, getSanitizedFileName } from './utils';

/**
 * Export audit logs in CSV format
 */
export const exportAuditLogsAsCSV = (
  { documentName, auditEvents }: ExportOptions
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
  const formattedDate = getFormattedDate();
  const sanitizedDocName = getSanitizedFileName(documentName);
  
  // Save file
  saveAs(blob, `audit-logs-${sanitizedDocName}-${formattedDate}.csv`);
};
