
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
    if (industry === 'Finance & Banking') {
      baseScenarios.push({
        id: 'financial-reg-update',
        name: 'Financial Services Compliance Update',
        description: 'Simulates updates to financial services compliance requirements',
        industry: 'Finance & Banking',
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
      
      // Add NYDFS specific scenario
      baseScenarios.push({
        id: 'nydfs-update',
        name: 'NYDFS 23 NYCRR 500 Update',
        description: 'Simulates changes to NY Department of Financial Services cybersecurity regulations',
        industry: 'Finance & Banking',
        actions: [
          'Update cybersecurity program',
          'Enhance incident response plan',
          'Implement multi-factor authentication'
        ],
        regulationChanges: [
          {
            regulation: 'NYDFS',
            changeType: 'stricter',
            impactLevel: 'high'
          }
        ],
        predictedImprovements: {
          overallScore: 14
        }
      });
    }
    
    // Healthcare specific scenarios
    if (industry === 'Healthcare' || industry === 'Pharmaceutical & Life Sciences') {
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
      
      // Add FDA compliance scenario for Pharmaceuticals
      if (industry === 'Pharmaceutical & Life Sciences') {
        baseScenarios.push({
          id: 'fda-compliance-update',
          name: 'FDA CFR Part 11 Updates',
          description: 'Simulates changes to FDA electronic records regulations',
          industry: 'Pharmaceutical & Life Sciences',
          actions: [
            'Enhance electronic signature validation',
            'Update audit trail procedures',
            'Implement system validation protocols'
          ],
          regulationChanges: [
            {
              regulation: 'FDA CFR Part 11',
              changeType: 'updated',
              impactLevel: 'high'
            }
          ],
          predictedImprovements: {
            overallScore: 16
          }
        });
      }
    }
    
    // Technology specific scenarios
    if (industry === 'Cloud & SaaS') {
      baseScenarios.push({
        id: 'tech-data-regulations',
        name: 'Technology Data Protection Updates',
        description: 'Simulates new data protection requirements for technology companies',
        industry: 'Cloud & SaaS',
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
      
      // Add ISO 27001 scenario for Cloud providers
      baseScenarios.push({
        id: 'iso-27001-update',
        name: 'ISO 27001 Certification Requirements',
        description: 'Simulates updated ISO 27001 certification requirements for cloud providers',
        industry: 'Cloud & SaaS',
        actions: [
          'Update information security management system',
          'Enhance risk assessment methodology',
          'Implement continuous monitoring'
        ],
        regulationChanges: [
          {
            regulation: 'ISO/IEC 27001',
            changeType: 'updated',
            impactLevel: 'medium'
          }
        ],
        predictedImprovements: {
          overallScore: 13
        }
      });
    }
    
    // E-commerce & Retail scenarios
    if (industry === 'E-commerce & Retail') {
      baseScenarios.push({
        id: 'ccpa-update',
        name: 'CCPA/CPRA Enforcement Changes',
        description: 'Simulates stricter enforcement of California privacy regulations',
        industry: 'E-commerce & Retail',
        actions: [
          'Update privacy notices',
          'Enhance data subject request handling',
          'Implement right to deletion processes'
        ],
        regulationChanges: [
          {
            regulation: 'CCPA',
            changeType: 'stricter',
            impactLevel: 'high'
          }
        ],
        predictedImprovements: {
          overallScore: 15
        }
      });
      
      // Add PCI DSS scenario for retailers
      baseScenarios.push({
        id: 'pci-dss-4-update',
        name: 'PCI DSS 4.0 Transition',
        description: 'Simulates transition to PCI DSS 4.0 requirements',
        industry: 'E-commerce & Retail',
        actions: [
          'Implement customized approach documentation',
          'Enhance authentication requirements',
          'Update encryption protocols'
        ],
        regulationChanges: [
          {
            regulation: 'PCI-DSS',
            changeType: 'updated',
            impactLevel: 'high'
          }
        ],
        predictedImprovements: {
          overallScore: 16,
          pciDssScore: 25
        }
      });
    }
  }
  
  return baseScenarios;
}
