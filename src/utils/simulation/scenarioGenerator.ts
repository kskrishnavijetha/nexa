
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
      impactLevel: 'high',
      scoreImpact: {
        overall: -15,
        gdpr: -20,
        hipaa: -10,
        soc2: -15,
        pciDss: -12
      },
      regulationChanges: [
        { regulation: 'GDPR', changeType: 'stricter', impactLevel: 'high' },
        { regulation: 'CCPA', changeType: 'stricter', impactLevel: 'medium' }
      ]
    },
    {
      id: 'standard-periodic-audit',
      name: 'Standard Periodic Audit',
      description: 'Regular compliance audit with no significant regulatory changes',
      industry: 'Global',
      impactLevel: 'low',
      scoreImpact: {
        overall: -5,
        gdpr: -5,
        hipaa: -5,
        soc2: -5,
        pciDss: -5
      },
      regulationChanges: [
        { regulation: 'Internal', changeType: 'audit', impactLevel: 'low' }
      ]
    },
    {
      id: 'new-regional-regulation',
      name: 'New Regional Regulation',
      description: 'A new regional privacy regulation is introduced affecting your operations',
      industry: 'Global',
      impactLevel: 'medium',
      scoreImpact: {
        overall: -10,
        gdpr: -5,
        hipaa: -5,
        soc2: -10,
        pciDss: -5
      },
      regulationChanges: [
        { regulation: 'Regional', changeType: 'new', impactLevel: 'medium' }
      ]
    }
  ];
  
  // Industry-specific scenarios
  if (industry === 'Healthcare') {
    baseScenarios.push({
      id: 'healthcare-hipaa-changes',
      name: 'HIPAA Compliance Changes',
      description: 'Major updates to HIPAA requirements for patient data protection',
      industry: 'Healthcare',
      impactLevel: 'high',
      scoreImpact: {
        overall: -20,
        gdpr: -5,
        hipaa: -30,
        soc2: -10,
        pciDss: -5
      },
      regulationChanges: [
        { regulation: 'HIPAA', changeType: 'stricter', impactLevel: 'high' }
      ]
    });
  } else if (industry === 'Finance') {
    baseScenarios.push({
      id: 'finance-pci-dss-update',
      name: 'PCI DSS 4.0 Adoption',
      description: 'Implementation of PCI DSS 4.0 with enhanced security requirements',
      industry: 'Finance',
      impactLevel: 'high',
      scoreImpact: {
        overall: -15,
        gdpr: -5,
        hipaa: 0,
        soc2: -10,
        pciDss: -25
      },
      regulationChanges: [
        { regulation: 'PCI DSS', changeType: 'stricter', impactLevel: 'high' }
      ]
    });
  } else if (industry === 'Technology') {
    baseScenarios.push({
      id: 'tech-ai-regulations',
      name: 'New AI Governance Rules',
      description: 'Introduction of new regulations for AI systems and algorithmic decision-making',
      industry: 'Technology',
      impactLevel: 'medium',
      scoreImpact: {
        overall: -12,
        gdpr: -15,
        hipaa: -5,
        soc2: -15,
        pciDss: -5
      },
      regulationChanges: [
        { regulation: 'AI Governance', changeType: 'new', impactLevel: 'medium' },
        { regulation: 'GDPR', changeType: 'interpretation', impactLevel: 'medium' }
      ]
    });
  }
  
  return baseScenarios;
};
