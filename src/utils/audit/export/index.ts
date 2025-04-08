
import { AuditEvent } from '@/components/audit/types';
import { exportAuditLogsAsJSON } from './jsonExporter';
import { exportAuditLogsAsCSV } from './csvExporter';
import { exportAuditLogsAsPDF } from './pdfExporter';
import { AuditExportFormat } from './types';

/**
 * Export audit logs in the specified format
 */
export const exportAuditLogs = (
  documentName: string,
  auditEvents: AuditEvent[],
  format: AuditExportFormat
): void => {
  const exportOptions = { documentName, auditEvents };
  
  switch (format) {
    case 'json':
      exportAuditLogsAsJSON(exportOptions);
      break;
    case 'csv':
      exportAuditLogsAsCSV(exportOptions);
      break;
    case 'pdf':
      exportAuditLogsAsPDF(exportOptions);
      break;
  }
};

// Re-export the AuditExportFormat type
export type { AuditExportFormat } from './types';
