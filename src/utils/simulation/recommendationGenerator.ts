
import { RiskItem, SimulationScenario } from '../types';

/**
 * Generate recommendations to mitigate predicted risks
 */
export function generateRecommendations(predictedRisks: RiskItem[], scenario: SimulationScenario): string[] {
  const recommendations: string[] = [];
  
  // Add general recommendations based on scenario
  scenario.regulationChanges.forEach(change => {
    switch(change.regulation) {
      case 'GDPR':
        if (change.changeType === 'stricter' || change.changeType === 'new') {
          recommendations.push('Implement a comprehensive data mapping and classification process to identify all personal data flows');
          recommendations.push('Review and update your data subject rights procedures to ensure compliance with enhanced requirements');
        }
        break;
      case 'HIPAA':
        if (change.changeType === 'stricter' || change.changeType === 'new') {
          recommendations.push('Enhance audit trail capabilities to track all PHI access and modifications');
          recommendations.push('Update security risk assessment procedures to align with new HIPAA requirements');
        }
        break;
      case 'SOC 2':
        if (change.changeType === 'stricter' || change.changeType === 'updated') {
          recommendations.push('Strengthen change management controls with additional approval workflows');
          recommendations.push('Enhance system monitoring capabilities to detect security events in real-time');
        }
        break;
      case 'PCI-DSS':
        if (change.changeType === 'stricter' || change.changeType === 'new') {
          recommendations.push('Implement enhanced network segmentation to better protect cardholder data environment');
          recommendations.push('Review and upgrade cryptographic controls for payment data protection');
        }
        break;
    }
  });
  
  // Add risk-specific recommendations
  const highSeverityRisks = predictedRisks.filter(risk => risk.severity === 'high');
  if (highSeverityRisks.length > 0) {
    recommendations.push('Develop a prioritized remediation plan focusing on high-severity risks');
  }
  
  // Add unique recommendations based on regulation areas with multiple risks
  const regulationRiskCounts: Record<string, number> = {};
  predictedRisks.forEach(risk => {
    regulationRiskCounts[risk.regulation] = (regulationRiskCounts[risk.regulation] || 0) + 1;
  });
  
  Object.entries(regulationRiskCounts).forEach(([regulation, count]) => {
    if (count >= 2) {
      recommendations.push(`Conduct a focused compliance review of ${regulation} controls to address multiple identified risks`);
    }
  });
  
  // Return unique set of recommendations
  return [...new Set(recommendations)];
}
