
import { ApiResponse, ComplianceReport, Industry, Region, INDUSTRY_REGULATIONS, REGION_REGULATIONS } from './types';
import { generateRisks } from './riskService';
import { generateSuggestions } from './suggestionService';
import { generateSummary } from './summaryService';
import { generateScores } from './scoreService';
import { SupportedLanguage, getLanguagePreference } from './language';

/**
 * Request a compliance check for an uploaded document
 */
export const requestComplianceCheck = async (
  documentId: string,
  documentName: string,
  industry?: Industry,
  language?: SupportedLanguage,
  region?: Region
): Promise<ApiResponse<ComplianceReport>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get language preference or use provided language
    const userLanguage = language || getLanguagePreference();
    
    // Get applicable regulations based on industry
    const regulations = industry ? INDUSTRY_REGULATIONS[industry] : [];
    
    // Get regional regulations if a region is specified
    const regionalRegulations = region && REGION_REGULATIONS[region] ? Object.keys(REGION_REGULATIONS[region]) : [];
    
    // Generate scores
    const { gdprScore, hipaaScore, soc2Score, pciDssScore, overallScore, industryScores } = generateScores(regulations);
    
    // Generate region-specific scores
    const regionScores: Record<string, number> = {};
    if (region && REGION_REGULATIONS[region]) {
      Object.keys(REGION_REGULATIONS[region]).forEach(regKey => {
        regionScores[regKey] = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
      });
    }
    
    // Define risks based on scores, regulations and regional regulations
    const risks = generateRisks(gdprScore, hipaaScore, soc2Score, pciDssScore, regulations, region);
    
    // Generate suggestions based on risks, regulations, and regional regulations
    const suggestions = generateSuggestions(regulations, region);
    
    // Create a relevant summary based on scores, industry, and region
    const summary = generateSummary(overallScore, gdprScore, hipaaScore, pciDssScore, industry, userLanguage, region);
    
    // Mock compliance report with real-time values
    const mockReport: ComplianceReport = {
      id: documentId, // Use documentId as id
      documentId,
      documentName,
      industry: industry || '',
      region: region || '',
      overallScore,
      gdprScore,
      hipaaScore,
      soc2Score,
      pciDssScore,
      industryScores,
      regionScores,
      regulations,
      regionalRegulations,
      risks,
      summary,
      suggestions,
      timestamp: new Date().toISOString(),
    };
    
    return {
      success: true,
      data: mockReport,
    };
  } catch (error) {
    console.error('Compliance check error:', error);
    return {
      success: false,
      error: 'Failed to analyze the document. Please try again.'
    };
  }
};
