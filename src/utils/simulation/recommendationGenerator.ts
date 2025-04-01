
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
          recommendations.push('Use AI-powered data discovery tools to automatically identify and classify personal data across systems');
        }
        break;
      case 'HIPAA':
        if (change.changeType === 'stricter' || change.changeType === 'new') {
          recommendations.push('Enhance audit trail capabilities to track all PHI access and modifications');
          recommendations.push('Update security risk assessment procedures to align with new HIPAA requirements');
          recommendations.push('Implement AI-based anomaly detection for PHI access monitoring to identify potential security breaches');
        }
        break;
      case 'SOC 2':
        if (change.changeType === 'stricter' || change.changeType === 'updated') {
          recommendations.push('Strengthen change management controls with additional approval workflows');
          recommendations.push('Enhance system monitoring capabilities to detect security events in real-time');
          recommendations.push('Deploy AI-powered security monitoring for proactive threat detection and response');
        }
        break;
      case 'PCI-DSS':
        if (change.changeType === 'stricter' || change.changeType === 'new') {
          recommendations.push('Implement enhanced network segmentation to better protect cardholder data environment');
          recommendations.push('Review and upgrade cryptographic controls for payment data protection');
          recommendations.push('Use AI-driven fraud detection systems to identify unusual payment patterns');
        }
        break;
    }
  });
  
  // Add risk-specific recommendations
  const highSeverityRisks = predictedRisks.filter(risk => risk.severity === 'high');
  if (highSeverityRisks.length > 0) {
    recommendations.push('Develop a prioritized remediation plan focusing on high-severity risks');
    recommendations.push('Use AI-powered risk assessment tools to continuously monitor high-severity risk areas');
  }
  
  // Add unique recommendations based on regulation areas with multiple risks
  const regulationRiskCounts: Record<string, number> = {};
  predictedRisks.forEach(risk => {
    regulationRiskCounts[risk.regulation] = (regulationRiskCounts[risk.regulation] || 0) + 1;
  });
  
  Object.entries(regulationRiskCounts).forEach(([regulation, count]) => {
    if (count >= 2) {
      recommendations.push(`Conduct a focused compliance review of ${regulation} controls to address multiple identified risks`);
      recommendations.push(`Implement AI-based continuous monitoring for ${regulation} compliance to prevent future issues`);
    }
  });
  
  // Add AI-specific recommendations
  recommendations.push('Deploy machine learning algorithms to predict potential compliance issues before they occur');
  recommendations.push('Implement AI-based document analysis to automatically identify compliance gaps in policies and procedures');
  recommendations.push('Use predictive analytics to forecast regulatory impact and prepare for upcoming changes');
  
  // Return unique set of recommendations
  return [...new Set(recommendations)];
}
