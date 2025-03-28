
import { ComplianceRisk } from '../types';
import { INDUSTRY_RISKS } from './types';

/**
 * Generate industry-specific risks based on the regulations
 */
export function generateIndustryRisks(regulations: string[]): ComplianceRisk[] {
  const risks: ComplianceRisk[] = [];
  
  // Add industry-specific risks
  regulations.forEach(regulation => {
    if (INDUSTRY_RISKS[regulation]) {
      // Add a random subset of industry risks
      const industryRisks = INDUSTRY_RISKS[regulation];
      const randomRiskCount = Math.floor(Math.random() * industryRisks.length) + 1;
      
      // Shuffle array to get random risks
      const shuffled = [...industryRisks].sort(() => 0.5 - Math.random());
      
      // Take the first n items
      risks.push(...shuffled.slice(0, randomRiskCount));
    }
  });
  
  return risks;
}
