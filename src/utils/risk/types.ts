
import { ComplianceRisk, Region } from '../types';

// Export INDUSTRY_RISKS constant  
export const INDUSTRY_RISKS: Record<string, ComplianceRisk[]> = {
  'GDPR': [
    {
      id: 'gdpr-ind-1',
      title: 'Cross-border Data Transfer Risk',
      description: 'Inadequate safeguards for international data transfers',
      severity: 'high',
      regulation: 'GDPR',
      mitigation: 'Implement Standard Contractual Clauses (SCCs)'
    },
    {
      id: 'gdpr-ind-2',
      title: 'Data Subject Rights Processing',
      description: 'Insufficient processes for handling data subject requests',
      severity: 'medium',
      regulation: 'GDPR',
      mitigation: 'Establish formal data subject request procedures'
    }
  ],
  'HIPAA': [
    {
      id: 'hipaa-ind-1',
      title: 'Healthcare Data Access Controls',
      description: 'Inadequate access controls for PHI',
      severity: 'high',
      regulation: 'HIPAA',
      mitigation: 'Implement role-based access control'
    }
  ],
  'SOC 2': [
    {
      id: 'soc2-ind-1',
      title: 'Vendor Management Risk',
      description: 'Insufficient monitoring of third-party service providers',
      severity: 'medium',
      regulation: 'SOC 2',
      mitigation: 'Establish vendor assessment program'
    }
  ]
};

// Export REGION_RISKS constant
export const REGION_RISKS: Record<string, ComplianceRisk[]> = {
  'us': [
    {
      id: 'us-risk-1',
      title: 'CCPA Compliance Gap',
      description: 'Missing consumer notice requirements',
      severity: 'medium',
      regulation: 'CCPA',
      mitigation: 'Update privacy notices for California residents'
    }
  ],
  'eu': [
    {
      id: 'eu-risk-1',
      title: 'Data Protection Impact Assessment',
      description: 'DPIA not conducted for high-risk processing',
      severity: 'high',
      regulation: 'GDPR',
      mitigation: 'Conduct DPIAs for high-risk processing activities'
    }
  ],
  'uk': [
    {
      id: 'uk-risk-1',
      title: 'UK GDPR Alignment',
      description: 'Policies not updated for UK GDPR specifics',
      severity: 'medium',
      regulation: 'UK GDPR',
      mitigation: 'Review and update policies for UK GDPR compliance'
    }
  ],
  'North America': [
    {
      id: 'na-risk-1',
      title: 'State Privacy Law Patchwork',
      description: 'Not compliant with multiple state privacy laws',
      severity: 'medium',
      regulation: 'State Laws',
      mitigation: 'Create a unified compliance approach for state laws'
    }
  ],
  'Global': [
    {
      id: 'global-risk-1',
      title: 'Global Data Transfer Mechanism',
      description: 'Inconsistent approach to international data transfers',
      severity: 'high',
      regulation: 'Multiple',
      mitigation: 'Implement a global data transfer framework'
    }
  ]
};
