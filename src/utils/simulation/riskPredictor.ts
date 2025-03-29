
import { Risk, SimulationScenario, RiskItem } from '@/utils/types';

/**
 * Generate predicted risks based on simulation scenario
 */
export function generatePredictedRisks(
  currentRisks: RiskItem[],
  scenario: SimulationScenario,
  adjustedScores: any
): Risk[] {
  const predictedRisks: Risk[] = [];
  
  // Based on regulation changes in the scenario, predict new risks
  scenario.regulationChanges.forEach(change => {
    if (change.changeType === 'stricter' || change.changeType === 'new') {
      if (change.regulation === 'GDPR') {
        predictedRisks.push({
          id: `predicted-gdpr-${Date.now()}`,
          title: 'Additional GDPR Requirements',
          description: 'New requirements for data protection impact assessments',
          severity: 'medium',
          mitigation: 'Implement DPIA procedures for high-risk processing',
          regulation: 'GDPR',
          section: 'Article 35'
        });
      }
      
      if (change.regulation === 'HIPAA') {
        predictedRisks.push({
          id: `predicted-hipaa-${Date.now()}`,
          title: 'Enhanced PHI Protection',
          description: 'Stricter requirements for protecting PHI in transit',
          severity: 'high',
          mitigation: 'Implement end-to-end encryption for all PHI transfers',
          regulation: 'HIPAA',
          section: '§164.312'
        });
      }
    }
    
    if (change.impactLevel === 'high') {
      if (change.regulation === 'PCI-DSS') {
        predictedRisks.push({
          id: `predicted-pci-${Date.now()}`,
          title: 'New PCI DSS Compliance',
          description: 'New requirements for multi-factor authentication',
          severity: 'high',
          mitigation: 'Implement MFA for all system access',
          regulation: 'PCI-DSS',
          section: 'Requirement 8.4'
        });
      }
      
      if (change.regulation === 'SOC 2') {
        predictedRisks.push({
          id: `predicted-soc2-${Date.now()}`,
          title: 'SOC 2 Security Updates',
          description: 'Enhanced monitoring requirements for access events',
          severity: 'medium',
          mitigation: 'Implement comprehensive logging and monitoring',
          regulation: 'SOC 2',
          section: 'CC7.2'
        });
      }
    }
    
    if (adjustedScores.gdprScore < 70) {
      predictedRisks.push({
        id: `predicted-score-gdpr-${Date.now()}`,
        title: 'GDPR Score Risk',
        description: 'Low GDPR compliance score presents significant risk',
        severity: 'medium',
        mitigation: 'Conduct a comprehensive GDPR gap analysis',
        regulation: 'GDPR',
        section: 'General'
      });
    }
    
    if (adjustedScores.hipaaScore < 65) {
      predictedRisks.push({
        id: `predicted-score-hipaa-${Date.now()}`,
        title: 'HIPAA Score Risk',
        description: 'Declining HIPAA compliance score requires attention',
        severity: 'high',
        mitigation: 'Prioritize HIPAA compliance remediation',
        regulation: 'HIPAA',
        section: 'General'
      });
    }
    
    if (adjustedScores.soc2Score < 70) {
      predictedRisks.push({
        id: `predicted-score-soc2-${Date.now()}`,
        title: 'SOC 2 Risk',
        description: 'Projected SOC 2 compliance issues need addressing',
        severity: 'high',
        mitigation: 'Address security controls before audit period',
        regulation: 'SOC 2',
        section: 'General'
      });
    }
    
    if (adjustedScores.pciDssScore < 75) {
      predictedRisks.push({
        id: `predicted-score-pci-${Date.now()}`,
        title: 'PCI Compliance Issue',
        description: 'PCI DSS compliance score below threshold',
        severity: 'medium',
        mitigation: 'Review and update cardholder data environment',
        regulation: 'PCI-DSS',
        section: 'General'
      });
    }
  });
  
  return predictedRisks;
}
