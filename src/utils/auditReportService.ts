
import { AuditEvent } from '@/components/audit/types';
import { generatePDFReport } from './audit';
import { Industry } from '@/utils/types';
import { getAuditReportFileName as getFileName } from './audit/fileUtils';

/**
 * Generate a downloadable audit logs report PDF with AI insights
 */
export const generateAuditReport = async (
  documentName: string,
  auditEvents: AuditEvent[],
  industry?: Industry
): Promise<Blob> => {
  try {
    console.log(`Generating audit logs report for ${documentName} with ${auditEvents.length} events`);
    console.log(`Industry for audit logs report: ${industry || 'not specified'}`);
    return await generatePDFReport(documentName, auditEvents, industry);
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

/**
 * Generate a standardized filename for the audit logs report
 */
export const getAuditReportFileName = (documentName: string): string => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const sanitizedDocName = documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  return `audit-logs-${sanitizedDocName}-${formattedDate}.pdf`;
};
