
import { AuditEvent } from '@/components/audit/types';
import { generatePDFReport, generateLogReport, getAuditReportFileName as getFileName } from './audit';
import { Industry } from '@/utils/types';

/**
 * Generate a downloadable audit trail report PDF with AI insights
 */
export const generateAuditReport = async (
  documentName: string,
  auditEvents: AuditEvent[],
  industry?: Industry,
  complianceScore?: number,
  complianceStatus?: string
): Promise<Blob> => {
  try {
    console.log(`Generating audit report for ${documentName} with ${auditEvents.length} events`);
    console.log(`Industry for audit report: ${industry || 'not specified'}`);
    console.log(`Compliance score: ${complianceScore !== undefined ? complianceScore + '%' : 'not specified'}`);
    console.log(`Compliance status: ${complianceStatus || 'not specified'}`);
    
    return await generatePDFReport(documentName, auditEvents, industry, complianceScore, complianceStatus);
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

/**
 * Generate a downloadable audit logs report PDF (simplified, without AI insights)
 */
export const generateAuditLogReport = async (
  documentName: string,
  auditEvents: AuditEvent[]
): Promise<Blob> => {
  try {
    console.log(`Generating audit logs report for ${documentName} with ${auditEvents.length} events`);
    
    return await generateLogReport(documentName, auditEvents);
  } catch (error) {
    console.error('Error generating logs report:', error);
    throw error;
  }
};

/**
 * Generate a standardized filename for the audit report
 */
export const getAuditReportFileName = (documentName: string): string => {
  return getFileName(documentName);
};
