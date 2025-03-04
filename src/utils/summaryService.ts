
import { Industry } from './types';

/**
 * Generate a summary based on compliance scores and industry
 */
export function generateSummary(
  overallScore: number, 
  gdprScore: number, 
  hipaaScore: number, 
  pciDssScore: number,
  industry?: Industry
): string {
  // Industry-specific prefix
  let industryPrefix = '';
  if (industry) {
    industryPrefix = `Based on our analysis of your document for ${industry} industry compliance, `;
  }

  if (overallScore > 85) {
    return `${industryPrefix}this document demonstrates a strong compliance posture overall, with only minor issues to address.`;
  } else if (overallScore > 70) {
    let issueAreas = '';
    
    // Determine specific compliance areas that need improvement
    const lowScores = [];
    
    if (gdprScore < 75) lowScores.push('GDPR data subject rights');
    if (hipaaScore < 70) lowScores.push('HIPAA data encryption requirements');
    if (pciDssScore < 75) lowScores.push('PCI-DSS cardholder data protection');
    
    // Add industry-specific context
    switch(industry) {
      case 'Healthcare':
        if (lowScores.length === 0) lowScores.push('healthcare data protection practices');
        break;
      case 'Financial Services':
        if (lowScores.length === 0) lowScores.push('financial data security standards');
        break;
      case 'Technology & IT':
        if (lowScores.length === 0) lowScores.push('technology security framework implementation');
        break;
      default:
        if (lowScores.length === 0) lowScores.push('documentation of compliance processes');
    }
    
    // Format the list of issue areas
    if (lowScores.length === 1) {
      issueAreas = lowScores[0];
    } else if (lowScores.length === 2) {
      issueAreas = `${lowScores[0]} and ${lowScores[1]}`;
    } else if (lowScores.length > 2) {
      const lastItem = lowScores.pop();
      issueAreas = `${lowScores.join(', ')}, and ${lastItem}`;
    }
    
    return `${industryPrefix}this document has several compliance areas that need improvement. The most critical issues relate to ${issueAreas}.`;
  } else {
    return `${industryPrefix}this document has significant compliance gaps that require immediate attention across multiple regulatory frameworks.`;
  }
}
