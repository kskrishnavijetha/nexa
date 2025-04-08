
import { AuditEvent } from '@/components/audit/types';
import { generatePDFReport, getAuditReportFileName as getFileName } from './audit';
import { Industry } from '@/utils/types';
import { exportAuditLogs, AuditExportFormat } from './audit/exportUtils';

/**
 * Generate a downloadable audit trail report PDF with AI insights
 */
export const generateAuditReport = async (
  documentName: string,
  auditEvents: AuditEvent[],
  industry?: Industry
): Promise<Blob> => {
  try {
    console.log(`Generating audit report for ${documentName} with ${auditEvents.length} events`);
    console.log(`Industry for audit report: ${industry || 'not specified'}`);
    return await generatePDFReport(documentName, auditEvents, industry);
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

/**
 * Generate a standardized filename for the audit report
 */
export const getAuditReportFileName = (documentName: string): string => {
  return getFileName(documentName);
};

/**
 * Export audit logs in the specified format (JSON, CSV, PDF)
 * This function is separate from the audit report generation
 */
export const exportAuditLogsInFormat = (
  documentName: string,
  auditEvents: AuditEvent[],
  format: AuditExportFormat
): void => {
  try {
    console.log(`Exporting audit logs for ${documentName} in ${format} format`);
    exportAuditLogs(documentName, auditEvents, format);
  } catch (error) {
    console.error(`Error exporting audit logs as ${format}:`, error);
    throw error;
  }
};
