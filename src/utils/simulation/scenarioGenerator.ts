
import { Industry } from '../types';
import { SimulationScenario, RegulationChange } from '@/utils/types';

// Helper function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Generate simulation scenarios based on industry
export function generateScenarios(industry?: Industry): SimulationScenario[] {
  // Base scenarios that apply to all industries
  const baseScenarios: SimulationScenario[] = [
    {
      id: generateId(),
      name: 'Enhanced Data Protection Measures',
      description: 'Implement additional data protection measures to strengthen compliance posture.',
      regulationChanges: [
        {
          regulation: 'GDPR',
          changeType: 'update',
          impactLevel: 'high',
          description: 'Stricter requirements for data subject access requests'
        }
      ],
      actions: [
        'Implement automated data subject request handling',
        'Update privacy policies',
        'Conduct staff training on new requirements'
      ]
    },
    {
      id: generateId(),
      name: 'Regulatory Changes Preparation',
      description: 'Prepare for upcoming regulatory changes in major compliance frameworks.',
      regulationChanges: [
        {
          regulation: 'GDPR',
          changeType: 'update',
          impactLevel: 'medium',
          description: 'Updated guidelines on cookies and tracking technologies'
        },
        {
          regulation: 'HIPAA',
          changeType: 'update',
          impactLevel: 'high',
          description: 'Enhanced security requirements for telehealth services'
        }
      ],
      actions: [
        'Review and update consent mechanisms',
        'Implement new security controls for digital services',
        'Update documentation and training materials'
      ]
    }
  ];

  // Industry-specific scenarios
  if (industry === 'Healthcare' || industry === 'Pharmaceutical & Biotech') {
    baseScenarios.push({
      id: generateId(),
      name: 'Patient Data Protection Enhancement',
      description: 'Strengthen safeguards for protected health information (PHI).',
      regulationChanges: [
        {
          regulation: 'HIPAA',
          changeType: 'new',
          impactLevel: 'high',
          description: 'New requirements for securing patient data in telehealth'
        }
      ],
      actions: [
        'Implement end-to-end encryption for telehealth services',
        'Enhance authentication for patient portals',
        'Establish audit trails for all PHI access'
      ]
    });
  }

  if (industry === 'Finance & Banking') {
    baseScenarios.push({
      id: generateId(),
      name: 'Financial Data Security Improvement',
      description: 'Enhance security measures for financial information and transactions.',
      regulationChanges: [
        {
          regulation: 'PCI-DSS',
          changeType: 'update',
          impactLevel: 'high',
          description: 'Stricter requirements for payment processing security'
        },
        {
          regulation: 'GLBA',
          changeType: 'update',
          impactLevel: 'medium',
          description: 'Updated requirements for customer data protection'
        }
      ],
      actions: [
        'Implement advanced encryption for financial transactions',
        'Enhance network segmentation for cardholder data',
        'Update privacy notices and customer consent forms'
      ]
    });
  }

  if (industry === 'Retail & Consumer' || industry === 'E-Commerce') {
    baseScenarios.push({
      id: generateId(),
      name: 'Customer Data Privacy Enhancement',
      description: 'Strengthen customer data privacy protections and consent mechanisms.',
      regulationChanges: [
        {
          regulation: 'CCPA',
          changeType: 'update',
          impactLevel: 'high',
          description: 'Expanded consumer rights for data access and deletion'
        },
        {
          regulation: 'GDPR',
          changeType: 'update',
          impactLevel: 'medium',
          description: 'Stricter requirements for processing customer consent'
        }
      ],
      actions: [
        'Enhance cookie consent management',
        'Implement comprehensive data subject rights portal',
        'Update privacy policies and marketing practices'
      ]
    });
  }

  if (industry === 'Government & Defense') {
    baseScenarios.push({
      id: generateId(),
      name: 'Critical Infrastructure Protection',
      description: 'Enhance security measures for critical infrastructure and classified information.',
      regulationChanges: [
        {
          regulation: 'CMMC',
          changeType: 'update',
          impactLevel: 'high',
          description: 'Updated cybersecurity maturity model requirements'
        },
        {
          regulation: 'FISMA',
          changeType: 'update',
          impactLevel: 'high',
          description: 'Stricter security controls for federal information systems'
        }
      ],
      actions: [
        'Implement enhanced threat monitoring',
        'Conduct regular security assessments',
        'Update incident response procedures'
      ]
    });
  }

  if (industry === 'Cloud & SaaS') {
    baseScenarios.push({
      id: generateId(),
      name: 'Multi-Cloud Compliance Strategy',
      description: 'Develop a unified compliance approach across multiple cloud environments.',
      regulationChanges: [
        {
          regulation: 'SOC 2',
          changeType: 'update',
          impactLevel: 'high',
          description: 'Enhanced requirements for cloud service providers'
        },
        {
          regulation: 'ISO/IEC 27001',
          changeType: 'update',
          impactLevel: 'medium',
          description: 'Updated security controls for cloud environments'
        }
      ],
      actions: [
        'Implement unified security policy management',
        'Establish automated compliance monitoring',
        'Create comprehensive data flow mapping'
      ]
    });
  }

  if (industry === 'Energy & Utilities') {
    baseScenarios.push({
      id: generateId(),
      name: 'Critical Infrastructure Security',
      description: 'Strengthen security measures for energy infrastructure and systems.',
      regulationChanges: [
        {
          regulation: 'NERC',
          changeType: 'update',
          impactLevel: 'high',
          description: 'Stricter requirements for electrical grid security'
        },
        {
          regulation: 'GDPR',
          changeType: 'update',
          impactLevel: 'medium',
          description: 'Updated requirements for consumer data protection'
        }
      ],
      actions: [
        'Implement enhanced OT/IT security measures',
        'Conduct regular penetration testing',
        'Establish comprehensive incident response procedures'
      ]
    });
  }

  if (industry === 'Education') {
    baseScenarios.push({
      id: generateId(),
      name: 'Student Data Protection Enhancement',
      description: 'Strengthen protections for student data in digital learning environments.',
      regulationChanges: [
        {
          regulation: 'FERPA',
          changeType: 'update',
          impactLevel: 'high',
          description: 'Updated requirements for student data in online learning'
        },
        {
          regulation: 'COPPA',
          changeType: 'update',
          impactLevel: 'medium',
          description: 'Stricter requirements for educational apps for minors'
        }
      ],
      actions: [
        'Implement enhanced parental consent mechanisms',
        'Review and update third-party educational app permissions',
        'Create comprehensive data handling procedures for remote learning'
      ]
    });
  }

  // Add more industry-specific scenarios as needed

  return baseScenarios;
}
