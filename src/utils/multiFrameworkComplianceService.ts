
import { ComplianceReport, Industry, Region } from './types';
import { requestComplianceCheck } from './complianceService';
import { generateRisks } from './risk/index';
import { generateSuggestions } from './suggestionService';
import { generateScores } from './scoreService';
import { SupportedLanguage } from './language';

/**
 * Map framework IDs to standard regulation names
 */
export const FRAMEWORK_TO_REGULATION_MAP: Record<string, string[]> = {
  'GDPR': ['GDPR'],
  'HIPAA': ['HIPAA'],
  'SOC2': ['SOC 2'],
  'ISO27001': ['ISO 27001'],
  'PCIDSS': ['PCI-DSS'],
  'GLBA': ['GLBA'],
  'CCPA': ['CCPA'],
  'NIST800-53': ['NIST CSF', 'NIST 800-53'],
  'SOX': ['SOX'],
  'FISMA': ['FISMA'],
  'FedRAMP': ['FedRAMP'],
  'LGPD': ['LGPD'],
  'PIPEDA': ['PIPEDA'],
  'PDPA': ['PDPA'],
  'UK-GDPR': ['UK GDPR'],
  'ePrivacy': ['ePrivacy Directive'],
  'APRA-CPS-234': ['APRA CPS 234'],
  'HITECH': ['HITECH'],
  'GDPR-Health': ['GDPR (Health)'],
  'ISO27799': ['ISO 27799'],
  'NHS-DSP': ['NHS DSP'],
  'ISO27017': ['ISO 27017'],
  'ISO27018': ['ISO 27018'],
  'CIS': ['CIS Controls'],
  'NIST-CSF': ['NIST CSF'],
  'CSA-CCM': ['CSA CCM'],
  'FINRA': ['FINRA'],
  'MAS-TRM': ['MAS TRM'],
  'EMIR-MiFID': ['EMIR/MiFID II']
};

/**
 * Get regulation strings from framework IDs
 */
export const getRegulationsFromFrameworks = (frameworkIds: string[]): string[] => {
  const regulations: string[] = [];
  
  frameworkIds.forEach(id => {
    if (FRAMEWORK_TO_REGULATION_MAP[id]) {
      regulations.push(...FRAMEWORK_TO_REGULATION_MAP[id]);
    }
  });
  
  return [...new Set(regulations)]; // Remove duplicates
};

/**
 * Request a multi-framework compliance check for an uploaded document
 */
export const requestMultiFrameworkComplianceCheck = async (
  documentId: string,
  documentName: string,
  selectedFrameworks: string[],
  industry?: Industry,
  language?: SupportedLanguage,
  region?: Region
): Promise<ComplianceReport> => {
  try {
    console.log(`[multiFrameworkComplianceService] Checking compliance against frameworks:`, selectedFrameworks);
    
    // Get regulations from selected frameworks
    const regulations = getRegulationsFromFrameworks(selectedFrameworks);
    
    // We'll use the standard compliance check but ensure the report includes all selected regulations
    const response = await requestComplianceCheck(documentId, documentName, industry, language, region);
    
    if (!response.success || !response.data) {
      throw new Error('Compliance check failed');
    }
    
    const report = response.data;
    
    // Enhance the report with multi-framework data
    const enhancedReport: ComplianceReport = {
      ...report,
      regulations: regulations,
      isMultiFramework: true,
      selectedFrameworks: selectedFrameworks,
      
      // Calculate framework-specific scores
      frameworkScores: selectedFrameworks.reduce((scores, framework) => {
        const frameworkRegs = FRAMEWORK_TO_REGULATION_MAP[framework] || [];
        scores[framework] = calculateFrameworkScore(frameworkRegs, report);
        return scores;
      }, {} as Record<string, number>)
    };
    
    console.log(`[multiFrameworkComplianceService] Generated multi-framework report with ${regulations.length} regulations`);
    
    return enhancedReport;
  } catch (error) {
    console.error('[multiFrameworkComplianceService] Error:', error);
    throw error;
  }
};

/**
 * Calculate a score for a specific framework based on the report's existing scores
 */
const calculateFrameworkScore = (frameworkRegulations: string[], report: ComplianceReport): number => {
  let frameworkScore = 0;
  
  // Map common regulations to their score properties in the report
  const mappings: Record<string, keyof ComplianceReport> = {
    'GDPR': 'gdprScore',
    'HIPAA': 'hipaaScore',
    'SOC 2': 'soc2Score',
    'PCI-DSS': 'pciDssScore',
  };
  
  // Count how many regulations we actually could calculate
  let countedRegulations = 0;
  
  // Add up scores for each regulation in this framework
  frameworkRegulations.forEach(regulation => {
    if (mappings[regulation] && report[mappings[regulation]] !== undefined) {
      frameworkScore += report[mappings[regulation]] as number;
      countedRegulations++;
    } else if (report.industryScores && report.industryScores[regulation]) {
      frameworkScore += report.industryScores[regulation];
      countedRegulations++;
    } else if (report.regionScores && report.regionScores[regulation]) {
      frameworkScore += report.regionScores[regulation];
      countedRegulations++;
    }
  });
  
  // If we didn't find any scores, use the overall score
  if (countedRegulations === 0) {
    return report.overallScore;
  }
  
  return Math.round(frameworkScore / countedRegulations);
};
