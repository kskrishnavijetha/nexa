
import { RiskItem, SimulationScenario } from '../types';

/**
 * Generate predicted risks based on the simulation scenario
 */
export function generatePredictedRisks(
  currentRisks: RiskItem[], 
  scenario: SimulationScenario,
  adjustedScores: any
): RiskItem[] {
  // Start with existing risks
  const predictedRisks: RiskItem[] = [...currentRisks];
  
  // For each regulation change, potentially add new risks
  scenario.regulationChanges.forEach(change => {
    if (change.changeType === 'stricter' || change.changeType === 'new') {
      // Define potential new risks based on regulation
      const potentialNewRisks: Record<string, RiskItem[]> = {
        'GDPR': [
          {
            id: 'gdpr-data-portability',
            description: 'Insufficient data portability mechanism',
            severity: 'medium',
            regulation: 'GDPR',
            section: 'Article 20'
          },
          {
            id: 'gdpr-cross-border',
            description: 'Inadequate cross-border data transfer safeguards',
            severity: 'high',
            regulation: 'GDPR',
            section: 'Article 44-50'
          }
        ],
        'HIPAA': [
          {
            id: 'hipaa-audit-controls',
            description: 'Insufficient audit controls for PHI access',
            severity: 'high',
            regulation: 'HIPAA',
            section: '164.312(b)'
          },
          {
            id: 'hipaa-emergency-access',
            description: 'Inadequate emergency access procedure',
            severity: 'medium',
            regulation: 'HIPAA',
            section: '164.312(a)(2)(ii)'
          }
        ],
        'SOC 2': [
          {
            id: 'soc2-change-management',
            description: 'Weak change management controls',
            severity: 'medium',
            regulation: 'SOC 2',
            section: 'CC8.1'
          },
          {
            id: 'soc2-monitoring',
            description: 'Insufficient system monitoring',
            severity: 'high',
            regulation: 'SOC 2',
            section: 'CC7.2'
          }
        ],
        'PCI-DSS': [
          {
            id: 'pci-network-security',
            description: 'Inadequate network security controls',
            severity: 'high',
            regulation: 'PCI-DSS',
            section: 'Requirement 1.1.4'
          },
          {
            id: 'pci-crypto-key-management',
            description: 'Insufficient cryptographic key management',
            severity: 'medium',
            regulation: 'PCI-DSS',
            section: 'Requirement 3.5'
          }
        ]
      };
      
      // Add 1-2 new risks if they don't already exist
      if (potentialNewRisks[change.regulation]) {
        const newRisks = potentialNewRisks[change.regulation];
        const numberOfRisksToAdd = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < Math.min(numberOfRisksToAdd, newRisks.length); i++) {
          const newRisk = newRisks[i];
          // Check if risk already exists
          const riskExists = predictedRisks.some(r => 
            r.description === newRisk.description && r.regulation === newRisk.regulation);
          
          if (!riskExists) {
            predictedRisks.push(newRisk);
          }
        }
      }
    }
  });
  
  return predictedRisks;
}
