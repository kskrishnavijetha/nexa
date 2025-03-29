
import { SimulationScenario, Industry } from '../types';

/**
 * Generate simulation scenarios based on industry
 */
export const generateScenarios = (industry: Industry): SimulationScenario[] => {
  // Base scenarios applicable to all industries
  const baseScenarios: SimulationScenario[] = [
    {
      id: 'global-regulation-stricter',
      name: 'Stricter Global Regulations',
      description: 'Major global privacy regulations become stricter with higher penalties',
      industry: 'Global',
      actions: ['Update compliance policies', 'Conduct training', 'Review data processing agreements'],
      regulationChanges: [
        { regulation: 'GDPR', changeType: 'stricter', impactLevel: 'high' },
        { regulation: 'CCPA', changeType: 'stricter', impactLevel: 'medium' }
      ],
      predictedImprovements: {
        overallScore: -15,
        gdprScore: -20,
        hipaaScore: -10,
        soc2Score: -15,
        pciDssScore: -12
      }
    },
    {
      id: 'standard-periodic-audit',
      name: 'Standard Periodic Audit',
      description: 'Regular compliance audit with no significant regulatory changes',
      industry: 'Global',
      actions: ['Regular compliance review', 'Document updates'],
      regulationChanges: [
        { regulation: 'Internal', changeType: 'updated', impactLevel: 'low' }
      ],
      predictedImprovements: {
        overallScore: -5,
        gdprScore: -5,
        hipaaScore: -5,
        soc2Score: -5,
        pciDssScore: -5
      }
    },
    {
      id: 'new-regional-regulation',
      name: 'New Regional Regulation',
      description: 'A new regional privacy regulation is introduced affecting your operations',
      industry: 'Global',
      actions: ['Assess impact', 'Develop compliance strategy', 'Update processes'],
      regulationChanges: [
        { regulation: 'Regional', changeType: 'new', impactLevel: 'medium' }
      ],
      predictedImprovements: {
        overallScore: -10,
        gdprScore: -5,
        hipaaScore: -5,
        soc2Score: -10,
        pciDssScore: -5
      }
    }
  ];
  
  // Industry-specific scenarios
  if (industry === 'Healthcare') {
    baseScenarios.push({
      id: 'healthcare-hipaa-changes',
      name: 'HIPAA Compliance Changes',
      description: 'Major updates to HIPAA requirements for patient data protection',
      industry: 'Healthcare',
      actions: ['Update patient data policies', 'Review data access controls'],
      regulationChanges: [
        { regulation: 'HIPAA', changeType: 'stricter', impactLevel: 'high' }
      ],
      predictedImprovements: {
        overallScore: -20,
        gdprScore: -5,
        hipaaScore: -30,
        soc2Score: -10,
        pciDssScore: -5
      }
    });
  } else if (industry === 'Financial Services' || industry === 'finance') {
    baseScenarios.push({
      id: 'finance-pci-dss-update',
      name: 'PCI DSS 4.0 Adoption',
      description: 'Implementation of PCI DSS 4.0 with enhanced security requirements',
      industry: 'Financial Services',
      actions: ['Payment security review', 'Implement stronger authentication'],
      regulationChanges: [
        { regulation: 'PCI DSS', changeType: 'stricter', impactLevel: 'high' }
      ],
      predictedImprovements: {
        overallScore: -15,
        gdprScore: -5,
        hipaaScore: 0,
        soc2Score: -10,
        pciDssScore: -25
      }
    });
  } else if (industry === 'Technology' || industry === 'technology') {
    baseScenarios.push({
      id: 'tech-ai-regulations',
      name: 'New AI Governance Rules',
      description: 'Introduction of new regulations for AI systems and algorithmic decision-making',
      industry: 'Technology',
      actions: ['AI system inventory', 'Algorithm review', 'Documentation updates'],
      regulationChanges: [
        { regulation: 'AI Governance', changeType: 'new', impactLevel: 'medium' },
        { regulation: 'GDPR', changeType: 'updated', impactLevel: 'medium' }
      ],
      predictedImprovements: {
        overallScore: -12,
        gdprScore: -15,
        hipaaScore: -5,
        soc2Score: -15,
        pciDssScore: -5
      }
    });
  }
  
  return baseScenarios;
};
