
import { AuditReportStatistics, ComplianceFinding } from '../../types';
import { Industry } from '@/utils/types';
import { mapToIndustryType, extractIndustryFromContent } from '../../industryUtils';
import { generateDefaultFindings } from './baseFindings';
import { generateIndustryFindings } from './industryFindings';

/**
 * Generate compliance findings based on audit statistics and industry
 */
export const generateComplianceFindings = (
  stats: AuditReportStatistics,
  documentName?: string,
  documentContent?: string
): ComplianceFinding[] => {
  // First check specifically for healthcare in the document name
  if (documentName && (
      documentName.toLowerCase().includes('health') || 
      documentName.toLowerCase().includes('medical') || 
      documentName.toLowerCase().includes('hospital') || 
      documentName.toLowerCase().includes('patient') || 
      documentName.toLowerCase().includes('clinic') ||
      documentName.toLowerCase().includes('doctor') ||
      documentName.toLowerCase().includes('care') ||
      documentName.toLowerCase().includes('hipaa'))) {
    console.log('Healthcare industry detected from keywords');
    return generateIndustryFindings(stats, 'Healthcare');
  }
  
  // Extract industry from document name if available
  let industry = extractIndustryFromDocument(documentName);
  
  // If industry still not determined and we have document content, try extracting from content
  if (!industry && documentContent) {
    industry = extractIndustryFromContent(documentContent);
  }
  
  // Generate industry-specific findings
  if (industry) {
    console.log(`Generating findings for industry: ${industry}`);
    return generateIndustryFindings(stats, industry);
  }
  
  // Default findings when no industry is identified
  console.log('No industry identified, using default findings');
  return generateDefaultFindings(stats);
};

/**
 * Extract the industry from document name with improved detection
 */
const extractIndustryFromDocument = (documentName?: string): Industry | undefined => {
  if (!documentName) return undefined;
  
  // Special case for healthcare (since that's the reported issue)
  if (documentName.toLowerCase().includes('health') || 
      documentName.toLowerCase().includes('medical') || 
      documentName.toLowerCase().includes('hospital') || 
      documentName.toLowerCase().includes('patient') || 
      documentName.toLowerCase().includes('clinic') ||
      documentName.toLowerCase().includes('doctor') ||
      documentName.toLowerCase().includes('care') ||
      documentName.toLowerCase().includes('hipaa')) {
    return 'Healthcare';
  }
  
  return mapToIndustryType(documentName);
};
