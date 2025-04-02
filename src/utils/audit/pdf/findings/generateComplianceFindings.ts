
import { AuditReportStatistics, ComplianceFinding } from '../../types';
import { Industry } from '@/utils/types';
import { mapToIndustryType } from '../../industryUtils';
import { generateDefaultFindings } from './baseFindings';
import { generateIndustryFindings } from './industryFindings';

/**
 * Generate compliance findings based on audit statistics and industry
 */
export const generateComplianceFindings = (
  stats: AuditReportStatistics,
  documentName?: string
): ComplianceFinding[] => {
  // Extract industry from document name if available
  const industry = extractIndustryFromDocument(documentName);
  
  // Generate industry-specific findings
  if (industry) {
    return generateIndustryFindings(stats, industry);
  }
  
  // Default findings when no industry is identified
  return generateDefaultFindings(stats);
};

/**
 * Extract the industry from document name
 */
const extractIndustryFromDocument = (documentName?: string): Industry | undefined => {
  return mapToIndustryType(documentName);
};
