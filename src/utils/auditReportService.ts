
import { AuditEvent } from '@/components/audit/types';
import { generatePDFReport, getAuditReportFileName as getFileName } from './audit';

/**
 * Generate a downloadable audit trail report PDF with AI insights
 */
export const generateAuditReport = async (
  documentName: string,
  auditEvents: AuditEvent[]
): Promise<Blob> => {
  try {
    console.log(`Generating audit report for ${documentName} with ${auditEvents.length} events`);
    return await generatePDFReport(documentName, auditEvents);
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
