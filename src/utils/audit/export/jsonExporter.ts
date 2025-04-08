
import { saveAs } from 'file-saver';
import { ExportOptions } from './types';
import { getFormattedDate, getSanitizedFileName } from './utils';

/**
 * Export audit logs in JSON format
 */
export const exportAuditLogsAsJSON = (
  { documentName, auditEvents }: ExportOptions
): void => {
  // Create a JSON blob
  const jsonData = JSON.stringify(auditEvents, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  
  // Generate filename
  const formattedDate = getFormattedDate();
  const sanitizedDocName = getSanitizedFileName(documentName);
  
  // Save file
  saveAs(blob, `audit-logs-${sanitizedDocName}-${formattedDate}.json`);
};
