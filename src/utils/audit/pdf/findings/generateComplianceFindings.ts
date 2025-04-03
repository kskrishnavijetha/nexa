
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
  documentContent?: string,
  selectedIndustry?: Industry // Add selectedIndustry parameter
): ComplianceFinding[] => {
  console.log(`[generateComplianceFindings] Generating findings with selectedIndustry: ${selectedIndustry || 'not specified'}`);
  
  // If an industry is explicitly selected, use it - this is the highest priority
  if (selectedIndustry) {
    console.log(`[generateComplianceFindings] Using explicitly selected industry: ${selectedIndustry}`);
    return generateIndustryFindings(stats, selectedIndustry);
  }

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
    console.log('[generateComplianceFindings] Healthcare industry detected from keywords');
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
    console.log(`[generateComplianceFindings] Generating findings for detected industry: ${industry}`);
    return generateIndustryFindings(stats, industry);
  }
  
  // Default findings when no industry is identified
  console.log('[generateComplianceFindings] No industry identified, using default findings');
  return generateDefaultFindings(stats);
};

// Helper function to extract industry from document name
const extractIndustryFromDocument = (documentName?: string): Industry | undefined => {
  if (!documentName) return undefined;
  
  const normalizedName = documentName.toLowerCase();
  
  // Special case for Finance & Banking - make this higher priority and more comprehensive
  if (normalizedName.includes('finance') || 
      normalizedName.includes('bank') || 
      normalizedName.includes('financial') ||
      normalizedName.includes('investment') ||
      normalizedName.includes('trading') ||
      normalizedName.includes('wealth') ||
      normalizedName.includes('asset management') ||
      normalizedName.includes('capital') ||
      normalizedName.includes('funding') ||
      normalizedName.includes('credit') ||
      normalizedName.includes('loan')) {
    console.log('[extractIndustryFromDocument] Detected Finance & Banking industry');
    return 'Finance & Banking';
  }
  
  // Special case for healthcare
  if (normalizedName.includes('health') || 
      normalizedName.includes('medical') || 
      normalizedName.includes('hospital') || 
      normalizedName.includes('patient') || 
      normalizedName.includes('clinic') ||
      normalizedName.includes('doctor') ||
      normalizedName.includes('care') ||
      normalizedName.includes('hipaa')) {
    console.log('[extractIndustryFromDocument] Detected Healthcare industry');
    return 'Healthcare';
  }
  
  // Use the general mapping function
  const mappedIndustry = mapToIndustryType(documentName);
  if (mappedIndustry) {
    console.log(`[extractIndustryFromDocument] Mapped to industry: ${mappedIndustry}`);
  }
  
  return mappedIndustry;
};
