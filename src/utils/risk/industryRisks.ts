
import { ComplianceRisk } from '../types';
import { INDUSTRY_RISKS } from './types';

/**
 * Generate industry-specific risks based on the regulations
 */
export function generateIndustryRisks(regulations: string[]): ComplianceRisk[] {
  const risks: ComplianceRisk[] = [];
  
  // If no regulations are specified, return empty array
  if (!regulations || regulations.length === 0) {
    return risks;
  }
  
  // Add industry-specific risks with more deterministic approach
  regulations.forEach(regulation => {
    if (INDUSTRY_RISKS[regulation]) {
      // Take a consistent subset of risks rather than random
      const industryRisks = INDUSTRY_RISKS[regulation];
      const riskCount = Math.min(3, industryRisks.length); // Always include at least 3 risks if available
      
      // Take the first n items (most relevant ones should be first in the array)
      risks.push(...industryRisks.slice(0, riskCount));
    }
  });
  
  return risks;
}
