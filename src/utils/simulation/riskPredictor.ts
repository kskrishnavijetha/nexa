
import { Industry } from '../types';
import { Risk, SimulationScenario, RiskItem } from '@/utils/types';

/**
 * Generate anticipated risks based on simulation scenario
 */
export function predictRisks(scenario: SimulationScenario, existingRisks: Risk[] = []): Risk[] {
  const predictedRisks: Risk[] = [];
  
  // Analyze regulation changes to predict risks
  scenario.regulationChanges.forEach(change => {
    // New regulatory requirements often introduce compliance risks
    if (change.changeType === 'new') {
      if (change.impactLevel === 'high') {
        predictedRisks.push({
          id: `pred-risk-${Math.random().toString(36).substring(2, 9)}`,
          title: `${change.regulation} Compliance Gap`,
          description: `Potential gap in compliance with new ${change.regulation} requirements: ${change.description}`,
          severity: 'high',
          regulation: change.regulation,
          mitigation: `Conduct ${change.regulation} readiness assessment`
        });
      } else {
        predictedRisks.push({
          id: `pred-risk-${Math.random().toString(36).substring(2, 9)}`,
          title: `${change.regulation} Adaptation Required`,
          description: `Need to adapt to new ${change.regulation} requirements: ${change.description}`,
          severity: 'medium',
          regulation: change.regulation,
          mitigation: `Review and update ${change.regulation} compliance programs`
        });
      }
    }
    
    // Updates to existing regulations
    if (change.changeType === 'update') {
      if (change.regulation === 'GDPR') {
        predictedRisks.push({
          id: `pred-risk-${Math.random().toString(36).substring(2, 9)}`,
          title: 'Data Protection Documentation Risk',
          description: `Need to update data protection documentation for ${change.description}`,
          severity: change.impactLevel === 'high' ? 'high' : 'medium',
          regulation: 'GDPR',
          mitigation: 'Review and update data protection policies and procedures'
        });
      }
      
      if (change.regulation === 'HIPAA') {
        predictedRisks.push({
          id: `pred-risk-${Math.random().toString(36).substring(2, 9)}`,
          title: 'PHI Security Controls Risk',
          description: `Potential gaps in PHI security controls for ${change.description}`,
          severity: change.impactLevel === 'high' ? 'high' : 'medium',
          regulation: 'HIPAA',
          mitigation: 'Enhance security controls for protected health information'
        });
      }
      
      if (change.regulation === 'SOC 2') {
        predictedRisks.push({
          id: `pred-risk-${Math.random().toString(36).substring(2, 9)}`,
          title: 'Service Organization Controls Risk',
          description: `Potential gaps in service controls for ${change.description}`,
          severity: change.impactLevel === 'high' ? 'high' : 'medium',
          regulation: 'SOC 2',
          mitigation: 'Update service organization controls and documentation'
        });
      }
      
      if (change.regulation === 'PCI-DSS') {
        predictedRisks.push({
          id: `pred-risk-${Math.random().toString(36).substring(2, 9)}`,
          title: 'Cardholder Data Environment Risk',
          description: `Security control gaps for cardholder data: ${change.description}`,
          severity: change.impactLevel === 'high' ? 'high' : 'medium',
          regulation: 'PCI-DSS',
          mitigation: 'Enhance security controls for cardholder data environment'
        });
      }
    }
    
    // Repeal of regulations can create compliance confusion
    if (change.changeType === 'repeal') {
      predictedRisks.push({
        id: `pred-risk-${Math.random().toString(36).substring(2, 9)}`,
        title: `${change.regulation} Transition Risk`,
        description: `Uncertainty during transition away from ${change.regulation} requirements`,
        severity: 'medium',
        regulation: change.regulation,
        mitigation: 'Develop transition plan and documentation updates'
      });
    }
  });
  
  // Add industry-specific predictive risks
  if (scenario.industry === 'Healthcare') {
    predictedRisks.push({
      id: `pred-risk-${Math.random().toString(36).substring(2, 9)}`,
      title: 'Patient Data Access Controls Risk',
      description: 'Potential weaknesses in access controls for patient data',
      severity: 'high',
      regulation: 'HIPAA',
      mitigation: 'Implement enhanced authentication and access monitoring'
    });
  }
  
  if (scenario.industry === 'Finance & Banking') {
    predictedRisks.push({
      id: `pred-risk-${Math.random().toString(36).substring(2, 9)}`,
      title: 'Financial Transaction Security Risk',
      description: 'Potential vulnerabilities in financial transaction processing',
      severity: 'high',
      regulation: 'PCI-DSS',
      mitigation: 'Implement enhanced encryption and transaction monitoring'
    });
  }
  
  return predictedRisks;
}
