
import { Industry, SimulationScenario } from '../types';

/**
 * Generate a set of simulation scenarios for predictive analysis
 */
export function generateSimulationScenarios(industry?: Industry): SimulationScenario[] {
  const defaultImpact = {
    gdprScore: 0,
    hipaaScore: 0,
    soc2Score: 0,
    pciDssScore: 0,
    overallScore: 0
  };

  const scenarios: SimulationScenario[] = [
    {
      id: 'strict-gdpr',
      name: 'Enhanced GDPR Requirements',
      description: 'Simulates stricter GDPR enforcement with additional data protection requirements.',
      regulationChanges: [
        { regulation: 'GDPR', changeType: 'stricter', impactLevel: 'high' }
      ],
      impact: defaultImpact
    },
    {
      id: 'new-hipaa',
      name: 'Updated HIPAA Security Rules',
      description: 'Simulates the introduction of enhanced HIPAA security requirements for healthcare providers.',
      regulationChanges: [
        { regulation: 'HIPAA', changeType: 'updated', impactLevel: 'medium' }
      ],
      impact: defaultImpact
    },
    {
      id: 'multi-regulation',
      name: 'Multi-Regulation Compliance Update',
      description: 'Simulates concurrent updates to multiple compliance frameworks affecting your organization.',
      regulationChanges: [
        { regulation: 'GDPR', changeType: 'updated', impactLevel: 'medium' },
        { regulation: 'SOC 2', changeType: 'stricter', impactLevel: 'high' },
        { regulation: 'PCI-DSS', changeType: 'updated', impactLevel: 'low' }
      ],
      impact: defaultImpact
    }
  ];
  
  // Add industry-specific scenarios if an industry is provided
  if (industry) {
    switch(industry) {
      case 'Healthcare':
        scenarios.push({
          id: 'healthcare-regulation',
          name: 'New Healthcare Data Sovereignty Rules',
          description: 'Simulates new requirements for healthcare data localization and sovereignty.',
          regulationChanges: [
            { regulation: 'HIPAA', changeType: 'new', impactLevel: 'high' },
            { regulation: 'HITECH', changeType: 'updated', impactLevel: 'medium' }
          ],
          impact: defaultImpact
        });
        break;
      case 'Financial Services':
        scenarios.push({
          id: 'financial-regulation',
          name: 'Enhanced Financial Security Standards',
          description: 'Simulates stricter security requirements for financial institutions.',
          regulationChanges: [
            { regulation: 'PCI-DSS', changeType: 'stricter', impactLevel: 'high' },
            { regulation: 'SOX', changeType: 'updated', impactLevel: 'medium' }
          ],
          impact: defaultImpact
        });
        break;
      case 'Technology & IT':
        scenarios.push({
          id: 'tech-privacy',
          name: 'New Global Privacy Framework',
          description: 'Simulates the introduction of a new global privacy standard affecting tech companies.',
          regulationChanges: [
            { regulation: 'GDPR', changeType: 'stricter', impactLevel: 'high' },
            { regulation: 'CCPA', changeType: 'updated', impactLevel: 'medium' },
            { regulation: 'ISO/IEC 27001', changeType: 'updated', impactLevel: 'medium' }
          ],
          impact: defaultImpact
        });
        break;
      default:
        // Add a generic scenario for other industries
        scenarios.push({
          id: 'industry-specific',
          name: `${industry} Regulatory Update`,
          description: `Simulates potential regulatory changes specific to the ${industry} industry.`,
          regulationChanges: [
            { regulation: 'ISO 9001', changeType: 'updated', impactLevel: 'medium' }
          ],
          impact: defaultImpact
        });
    }
  }
  
  return scenarios;
}
