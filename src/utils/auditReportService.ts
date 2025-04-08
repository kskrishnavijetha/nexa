
import { AuditEvent } from '@/components/audit/types';
import { generatePDFReport, getAuditReportFileName as getFileName } from './audit';
import { Industry } from '@/utils/types';

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
