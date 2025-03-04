
import { ApiResponse, ComplianceReport, Industry, INDUSTRY_REGULATIONS } from './types';
import { generateRisks } from './riskService';
import { generateSuggestions } from './suggestionService';
import { generateSummary } from './summaryService';
import { generateScores } from './scoreService';

/**
 * Request a compliance check for an uploaded document
 */
export const requestComplianceCheck = async (
  documentId: string,
  documentName: string,
  industry?: Industry
): Promise<ApiResponse<ComplianceReport>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get applicable regulations based on industry
    const regulations = industry ? INDUSTRY_REGULATIONS[industry] : [];
    
    // Generate scores
    const { gdprScore, hipaaScore, soc2Score, pciDssScore, overallScore, industryScores } = generateScores(regulations);
    
    // Define risks based on scores and regulations
    const risks = generateRisks(gdprScore, hipaaScore, soc2Score, pciDssScore, regulations);
    
    // Generate suggestions based on risks and regulations
    const suggestions = generateSuggestions(regulations);
    
    // Create a relevant summary based on scores and industry
    const summary = generateSummary(overallScore, gdprScore, hipaaScore, pciDssScore, industry);
    
    // Mock compliance report with real-time values
    const mockReport: ComplianceReport = {
      documentId,
      documentName,
      industry,
      overallScore,
      gdprScore,
      hipaaScore,
      soc2Score,
      pciDssScore,
      industryScores,
      regulations,
      risks,
      summary,
      suggestions,
      timestamp: new Date().toISOString()
    };
    
    return {
      data: mockReport,
      status: 200
    };
  } catch (error) {
    console.error('Compliance check error:', error);
    return {
      error: 'Failed to analyze the document. Please try again.',
      status: 500
    };
  }
};
