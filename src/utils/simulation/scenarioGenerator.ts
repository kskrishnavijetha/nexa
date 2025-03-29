
import { SimulationScenario, Industry, RegulationChange } from '@/utils/types';

/**
 * Generate simulation scenarios based on industry
 */
export function generateScenarios(industry?: Industry): SimulationScenario[] {
  // Generate base scenarios
  const baseScenarios: SimulationScenario[] = [
    {
      id: 'gdpr-stricter',
      name: 'GDPR Stricter Enforcement',
      description: 'Simulates stricter enforcement of GDPR regulations with higher penalties',
      industry: 'Global',
      actions: [
        'Update privacy policies',
        'Enhance data subject request processes',
        'Implement stronger consent management'
      ],
      regulationChanges: [
        {
          regulation: 'GDPR',
          changeType: 'stricter',
          impactLevel: 'high'
        }
      ],
      predictedImprovements: {
        overallScore: 15,
        gdprScore: 25
      }
    },
    {
      id: 'multi-reg-changes',
      name: 'Multiple Regulatory Updates',
      description: 'Simulates simultaneous changes to multiple regulations',
      industry: 'Global',
      actions: [
        'Comprehensive compliance review',
        'Staff training updates',
        'Technology updates for compliance tracking'
      ],
      regulationChanges: [
        {
          regulation: 'GDPR',
          changeType: 'updated',
          impactLevel: 'medium'
        },
        {
          regulation: 'HIPAA',
          changeType: 'stricter',
          impactLevel: 'high'
        },
        {
          regulation: 'SOC 2',
          changeType: 'updated',
          impactLevel: 'medium'
        }
      ],
      predictedImprovements: {
        overallScore: 18,
        gdprScore: 15,
        hipaaScore: 20,
        soc2Score: 18
      }
    },
    {
      id: 'new-regulation',
      name: 'New International Privacy Law',
      description: 'Simulates the impact of a new international privacy regulation',
      industry: 'Global',
      actions: [
        'Initial compliance assessment',
        'Gap analysis',
        'Implementation of new controls'
      ],
      regulationChanges: [
        {
          regulation: 'New Global Privacy Standard',
          changeType: 'new',
          impactLevel: 'high'
        }
      ],
      predictedImprovements: {
        overallScore: 10
      }
    }
  ];
  
  // Add industry-specific scenarios if an industry is specified
  if (industry) {
    // Financial services specific scenarios
    if (industry === 'finance' || industry === 'Financial Services') {
      baseScenarios.push({
        id: 'financial-reg-update',
        name: 'Financial Services Compliance Update',
        description: 'Simulates updates to financial services compliance requirements',
        industry: 'Financial Services',
        actions: [
          'Update transaction monitoring',
          'Enhance KYC processes',
          'Update security controls'
        ],
        regulationChanges: [
          {
            regulation: 'PCI-DSS',
            changeType: 'stricter',
            impactLevel: 'high'
          },
          {
            regulation: 'SOC 2',
            changeType: 'updated',
            impactLevel: 'medium'
          }
        ],
        predictedImprovements: {
          overallScore: 12,
          pciDssScore: 18,
          soc2Score: 10
        }
      });
    }
    
    // Healthcare specific scenarios
    if (industry === 'healthcare' || industry === 'Healthcare') {
      baseScenarios.push({
        id: 'healthcare-hipaa-update',
        name: 'HIPAA Regulatory Changes',
        description: 'Simulates changes to HIPAA regulations affecting healthcare providers',
        industry: 'Healthcare',
        actions: [
          'Update patient data handling procedures',
          'Enhance breach notification processes',
          'Implement additional training'
        ],
        regulationChanges: [
          {
            regulation: 'HIPAA',
            changeType: 'stricter',
            impactLevel: 'high'
          }
        ],
        predictedImprovements: {
          overallScore: 15,
          hipaaScore: 22
        }
      });
    }
    
    // Technology specific scenarios
    if (industry === 'technology' || industry === 'Technology' || industry === 'Technology & IT') {
      baseScenarios.push({
        id: 'tech-data-regulations',
        name: 'Technology Data Protection Updates',
        description: 'Simulates new data protection requirements for technology companies',
        industry: 'Technology',
        actions: [
          'Update data handling processes',
          'Enhance API security',
          'Implement stronger encryption'
        ],
        regulationChanges: [
          {
            regulation: 'GDPR',
            changeType: 'updated',
            impactLevel: 'medium'
          },
          {
            regulation: 'SOC 2',
            changeType: 'stricter',
            impactLevel: 'high'
          }
        ],
        predictedImprovements: {
          overallScore: 14,
          gdprScore: 12,
          soc2Score: 20
        }
      });
    }
  }
  
  return baseScenarios;
}
