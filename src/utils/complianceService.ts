
import { ApiResponse, ComplianceReport, Industry, Region } from './types';
import { generateRisks } from './risk/index';
import { generateSuggestions } from './suggestionService';
import { generateSummary } from './summaryService';
import { generateScores } from './scoreService';
import { SupportedLanguage, getLanguagePreference } from './language';
import { INDUSTRY_REGULATIONS, REGION_REGULATIONS } from './types';

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
    
    console.log(`[complianceService] Checking compliance for document: ${documentName}`);
    console.log(`[complianceService] Industry explicitly selected: ${industry || 'unspecified'}`);
    
    // Important: Always prioritize explicitly selected industry
    let selectedIndustry = industry;
    let applicableRegulations: string[] = [];
    
    // If an industry is explicitly selected, use its regulations
    if (selectedIndustry && INDUSTRY_REGULATIONS[selectedIndustry]) {
      applicableRegulations = [...INDUSTRY_REGULATIONS[selectedIndustry]];
      console.log(`[complianceService] Using regulations for explicitly selected industry ${selectedIndustry}:`, applicableRegulations);
    } else {
      // Default to Global if no industry specified
      selectedIndustry = 'Global' as Industry;
      applicableRegulations = [...INDUSTRY_REGULATIONS['Global']];
      console.log(`[complianceService] Using Global regulations:`, applicableRegulations);
    }
    
    // Get regional regulations if a region is specified
    const regionalRegulations = region && REGION_REGULATIONS[region] ? Object.keys(REGION_REGULATIONS[region]) : [];
    
    // Generate scores
    const { gdprScore, hipaaScore, soc2Score, pciDssScore, overallScore, industryScores } = generateScores(applicableRegulations);
    
    // Generate region-specific scores
    const regionScores: Record<string, number> = {};
    if (region && REGION_REGULATIONS[region]) {
      Object.keys(REGION_REGULATIONS[region]).forEach(regKey => {
        regionScores[regKey] = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
      });
    }
    
    // Define risks based on scores, regulations and regional regulations
    const risks = generateRisks(gdprScore, hipaaScore, soc2Score, pciDssScore, applicableRegulations, region);
    
    // Generate suggestions based on risks, regulations, and regional regulations
    const suggestions = generateSuggestions(applicableRegulations, region);
    
    // Create a relevant summary based on scores, industry, and region
    const summary = generateSummary(overallScore, gdprScore, hipaaScore, pciDssScore, selectedIndustry, userLanguage, region);
    
    // Extract organization name from document name if available
    const orgNameParts = documentName.split('-');
    const organization = orgNameParts.length > 0 && orgNameParts[0].trim() ? 
      orgNameParts[0].trim() : 
      'Organization';
    
    console.log(`[complianceService] Organization extracted: ${organization}`);
    
    // Mock compliance report with real-time values
    const mockReport: ComplianceReport = {
      documentId,
      documentName,
      industry: selectedIndustry,
      region: region || 'Global' as Region, // Default to Global if no region specified
      overallScore,
      gdprScore,
      hipaaScore,
      soc2Score,
      pciDssScore,
      industryScore: Math.round((industryScores ? Object.values(industryScores).reduce((a, b) => a + b, 0) / Object.values(industryScores).length : 0)),
      regionalScore: Math.round((regionScores ? Object.values(regionScores).reduce((a, b) => a + b, 0) / Object.values(regionScores).length : 0)),
      regulationScore: Math.round((gdprScore + hipaaScore + soc2Score + (pciDssScore || 0)) / 4),
      industryScores,
      regionScores,
      regulations: applicableRegulations,
      regionalRegulations: region && REGION_REGULATIONS[region] ? REGION_REGULATIONS[region] : undefined,
      risks,
      summary,
      suggestions,
      timestamp: new Date().toISOString(),
      scanDate: new Date().toISOString(), // Add scanDate
      complianceStatus: overallScore >= 80 ? 'compliant' : overallScore >= 60 ? 'partially-compliant' : 'non-compliant',
      organization: organization // Now this property exists in the interface
    };
    
    console.log(`[complianceService] Generated report for industry: ${selectedIndustry}, with regulations:`, applicableRegulations);
    
    return {
      success: true,
      data: mockReport,
    };
  } catch (error) {
    console.error('[complianceService] Compliance check error:', error);
    return {
      success: false,
      error: 'Failed to analyze the document. Please try again.'
    };
  }
};
