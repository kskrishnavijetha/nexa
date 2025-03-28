
import { ComplianceRisk, Region } from '../types';
import { generateGdprRisks, generateHipaaRisks, generateSoc2Risks, generatePciDssRisks } from './regulationRisks';
import { generateRegionRisks } from './regionRisks';
import { generateIndustryRisks } from './industryRisks';

/**
 * Generate compliance risks based on scores and relevant regulations
 */
export function generateRisks(
  gdprScore: number, 
  hipaaScore: number, 
  soc2Score: number, 
  pciDssScore: number, 
  regulations: string[] = [],
  region?: Region
): ComplianceRisk[] {
  let risks: ComplianceRisk[] = [];
  
  // Add regulation-specific risks based on scores
  if (regulations.includes('GDPR') || regulations.length === 0) {
    risks = [...risks, ...generateGdprRisks(gdprScore)];
  }
  
  if (regulations.includes('HIPAA') || regulations.length === 0) {
    risks = [...risks, ...generateHipaaRisks(hipaaScore)];
  }
  
  if (regulations.includes('SOC 2') || regulations.length === 0) {
    risks = [...risks, ...generateSoc2Risks(soc2Score)];
  }
  
  if (regulations.includes('PCI-DSS') || regulations.length === 0) {
    risks = [...risks, ...generatePciDssRisks(pciDssScore)];
  }
  
  // Add region-specific risks
  if (region) {
    const regionRisks = generateRegionRisks(region);
    risks = [...risks, ...regionRisks];
  }
  
  // Add industry-specific risks
  const industryRisks = generateIndustryRisks(regulations);
  risks = [...risks, ...industryRisks];
  
  return risks;
}

// Re-export all risk-related utilities
export * from './types';
export * from './regulationRisks';
export * from './regionRisks';
export * from './industryRisks';
