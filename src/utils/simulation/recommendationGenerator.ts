
import { RegulationChange, SimulationScenario } from '../types';

/**
 * Generate recommendations based on simulation scenario
 */
export function generateRecommendations(scenario: SimulationScenario): string[] {
  const recommendations: string[] = [];
  
  // Process each regulation change to generate specific recommendations
  scenario.regulationChanges.forEach(change => {
    // Generate recommendations based on regulation
    if (change.regulation === 'GDPR') {
      if (change.changeType === 'new' || change.changeType === 'update') {
        recommendations.push('Update privacy policies and data protection documentation');
        recommendations.push('Conduct a GDPR compliance gap assessment');
        
        if (change.impactLevel === 'high') {
          recommendations.push('Appoint or consult with a Data Protection Officer');
          recommendations.push('Implement enhanced data subject request handling procedures');
        }
      }
    }
    
    if (change.regulation === 'HIPAA') {
      if (change.changeType === 'new' || change.changeType === 'update') {
        recommendations.push('Update HIPAA policies and procedures documentation');
        recommendations.push('Conduct a HIPAA Security Risk Assessment');
        
        if (change.impactLevel === 'high') {
          recommendations.push('Enhance security controls for Protected Health Information (PHI)');
          recommendations.push('Update Business Associate Agreements');
        }
      }
    }
    
    if (change.regulation === 'SOC 2') {
      if (change.changeType === 'new' || change.changeType === 'update') {
        recommendations.push('Update service organization controls documentation');
        recommendations.push('Conduct a SOC 2 readiness assessment');
        
        if (change.impactLevel === 'high') {
          recommendations.push('Implement additional monitoring controls');
          recommendations.push('Review and enhance vendor management procedures');
        }
      }
    }
    
    if (change.regulation === 'PCI-DSS') {
      if (change.changeType === 'new' || change.changeType === 'update') {
        recommendations.push('Update cardholder data environment security controls');
        recommendations.push('Conduct a PCI-DSS gap assessment');
        
        if (change.impactLevel === 'high') {
          recommendations.push('Enhance encryption for cardholder data');
          recommendations.push('Implement stronger network segmentation');
        }
      }
    }
    
    // Generic recommendations based on change type
    if (change.changeType === 'new') {
      recommendations.push(`Develop compliance program for new ${change.regulation} requirements`);
      recommendations.push(`Train staff on new ${change.regulation} requirements`);
    }
    
    if (change.changeType === 'update') {
      recommendations.push(`Update existing compliance materials for ${change.regulation} changes`);
    }
    
    if (change.changeType === 'repeal') {
      recommendations.push(`Review and revise documentation to remove outdated ${change.regulation} compliance materials`);
      recommendations.push('Assess impact on overall compliance program');
    }
  });
  
  // Add general recommendations
  recommendations.push('Schedule regular compliance reviews');
  recommendations.push('Document all compliance-related changes');
  
  // Add industry-specific recommendations
  if (scenario.industry === 'Healthcare') {
    recommendations.push('Update patient data handling procedures');
    recommendations.push('Review telehealth security controls');
  }
  
  if (scenario.industry === 'Finance & Banking') {
    recommendations.push('Review financial transaction security controls');
    recommendations.push('Update customer financial data protection measures');
  }
  
  // Remove duplicates and limit to 10 recommendations
  const uniqueRecommendations = [...new Set(recommendations)];
  return uniqueRecommendations.slice(0, 10);
}
