
import { ComplianceRisk, Region } from '../types';
import { REGION_RISKS } from './types';
import { REGION_REGULATIONS } from '../types';

/**
 * Generate region-specific risks based on the region and regulations
 */
export function generateRegionRisks(region?: Region): ComplianceRisk[] {
  if (!region) return [];
  
  const risks: ComplianceRisk[] = [];
  let riskIdCounter = 1;
  const generateRiskId = () => `risk-${riskIdCounter++}`;
  
  // Add a subset of region-specific risks
  const regionRisks = REGION_RISKS[region];
  if (regionRisks) {
    const randomRiskCount = Math.min(3, Math.floor(Math.random() * regionRisks.length) + 1);
    
    // Shuffle array to get random risks
    const shuffled = [...regionRisks].sort(() => 0.5 - Math.random());
    
    // Take the first n items
    risks.push(...shuffled.slice(0, randomRiskCount));
  }
  
  // Add additional risks based on regional regulations
  const regionalRegulations = REGION_REGULATIONS[region];
  if (regionalRegulations) {
    Object.keys(regionalRegulations).forEach(regKey => {
      // Only add if not already covered and with 40% probability
      if (!risks.some(r => r.regulation === regKey) && Math.random() < 0.4) {
        risks.push({
          id: generateRiskId(),
          title: `${regKey} Compliance Risk`,
          description: `Potential compliance gap with ${regionalRegulations[regKey]}`,
          severity: Math.random() < 0.3 ? 'high' : 'medium',
          mitigation: `Conduct ${regKey} compliance assessment`,
          regulation: regKey
        });
      }
    });
  }
  
  return risks;
}
