
import { ApiResponse, ComplianceReport } from './types';
import { generateRisks } from './riskService';
import { generateSuggestions } from './suggestionService';
import { generateSummary } from './summaryService';
import { generateScores } from './scoreService';

/**
 * Request a compliance check for an uploaded document
 */
export const requestComplianceCheck = async (
  documentId: string,
  documentName: string
): Promise<ApiResponse<ComplianceReport>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate scores
    const { gdprScore, hipaaScore, soc2Score, pciDssScore, overallScore } = generateScores();
    
    // Define risks based on scores
    const risks = generateRisks(gdprScore, hipaaScore, soc2Score, pciDssScore);
    
    // Generate suggestions based on risks
    const suggestions = generateSuggestions();
    
    // Create a relevant summary based on scores
    const summary = generateSummary(overallScore, gdprScore, hipaaScore, pciDssScore);
    
    // Mock compliance report with real-time values
    const mockReport: ComplianceReport = {
      documentId,
      documentName,
      overallScore,
      gdprScore,
      hipaaScore,
      soc2Score,
      pciDssScore,
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
