
import { RiskItem } from './types';

/**
 * Generate compliance risks based on scores
 */
export function generateRisks(gdprScore: number, hipaaScore: number, soc2Score: number, pciDssScore: number): RiskItem[] {
  const risks: RiskItem[] = [];
  
  // Add GDPR risks if score is below threshold
  if (gdprScore < 90) {
    risks.push({
      description: 'Personal data storage duration not specified',
      severity: 'medium',
      regulation: 'GDPR',
      section: 'Article 5'
    });
  }
  
  if (gdprScore < 75) {
    risks.push({
      description: 'No clear process for data subject access requests',
      severity: 'high',
      regulation: 'GDPR',
      section: 'Article 15'
    });
  }
  
  // Add HIPAA risks if score is below threshold
  if (hipaaScore < 85) {
    risks.push({
      description: 'Insufficient details on physical safeguards',
      severity: 'medium',
      regulation: 'HIPAA',
      section: '164.310'
    });
  }
  
  if (hipaaScore < 70) {
    risks.push({
      description: 'Missing data encryption requirements',
      severity: 'high',
      regulation: 'HIPAA',
      section: '164.312(a)(2)(iv)'
    });
  }
  
  // Add SOC2 risks if score is below threshold
  if (soc2Score < 80) {
    risks.push({
      description: 'Access control policy needs enhancement',
      severity: 'low',
      regulation: 'SOC2',
      section: 'CC6.1'
    });
  }
  
  // Add PCI-DSS related risks
  if (pciDssScore < 85) {
    risks.push({
      description: 'Insufficient network segmentation for cardholder data environment',
      severity: 'high',
      regulation: 'GDPR',
      section: 'PCI-DSS Requirement 1.3'
    });
  }
  
  if (pciDssScore < 75) {
    risks.push({
      description: 'Weak encryption standards for stored cardholder data',
      severity: 'high',
      regulation: 'HIPAA',
      section: 'PCI-DSS Requirement 3.4'
    });
  }
  
  if (pciDssScore < 90) {
    risks.push({
      description: 'Inadequate access control measures',
      severity: 'medium',
      regulation: 'SOC2',
      section: 'PCI-DSS Requirement 7.1'
    });
  }
  
  return risks;
}
