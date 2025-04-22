
import { ComplianceFrameworkStats } from './types';

// Mapping of compliance frameworks to their controls
const frameworkControls = {
  'SOC 2': {
    'CC1.1': 'COSO Principle 1: Demonstrates Commitment to Integrity and Ethical Values',
    'CC1.2': 'COSO Principle 2: Exercises Oversight Responsibility',
    'CC2.1': 'COSO Principle 6: Specifies Suitable Objectives',
    'CC2.2': 'COSO Principle 7: Identifies and Analyzes Risk',
    'CC3.1': 'COSO Principle 10: Selects and Develops Control Activities',
    'CC4.1': 'COSO Principle 13: Uses Relevant Information',
    'CC5.1': 'COSO Principle 14: Communicates Internally',
    'CC5.2': 'COSO Principle 15: Communicates Externally',
    'CC6.1': 'Manages Security Policies',
    'CC6.2': 'Manages Security Architecture',
    'CC7.1': 'Manages Change Management Process',
    'CC7.2': 'Performs Security Monitoring',
    'CC8.1': 'Manages Data Lifecycle',
    'CC9.1': 'Manages Compliance with Laws and Regulations',
  },
  'HIPAA': {
    '§164.308(a)(1)': 'Security Management Process',
    '§164.308(a)(2)': 'Assigned Security Responsibility',
    '§164.308(a)(3)': 'Workforce Security',
    '§164.308(a)(4)': 'Information Access Management',
    '§164.308(a)(5)': 'Security Awareness and Training',
    '§164.308(a)(6)': 'Security Incident Procedures',
    '§164.308(a)(7)': 'Contingency Plan',
    '§164.308(a)(8)': 'Evaluation',
    '§164.310(a)': 'Facility Access Controls',
    '§164.310(b)': 'Workstation Use',
    '§164.310(c)': 'Workstation Security',
    '§164.310(d)': 'Device and Media Controls',
    '§164.312(a)': 'Access Control',
    '§164.312(b)': 'Audit Controls',
    '§164.312(c)': 'Integrity',
    '§164.312(d)': 'Person or Entity Authentication',
    '§164.312(e)': 'Transmission Security',
  },
  'GDPR': {
    'Art. 5': 'Principles relating to processing of personal data',
    'Art. 6': 'Lawfulness of processing',
    'Art. 7': 'Conditions for consent',
    'Art. 12': 'Transparent information, communication and modalities for the exercise of the rights',
    'Art. 13': 'Information to be provided where personal data are collected from the data subject',
    'Art. 14': 'Information to be provided where personal data have not been obtained from the data subject',
    'Art. 15': 'Right of access by the data subject',
    'Art. 16': 'Right to rectification',
    'Art. 17': 'Right to erasure',
    'Art. 18': 'Right to restriction of processing',
    'Art. 25': 'Data protection by design and by default',
    'Art. 30': 'Records of processing activities',
    'Art. 32': 'Security of processing',
    'Art. 33': 'Notification of a personal data breach to the supervisory authority',
    'Art. 35': 'Data protection impact assessment',
  },
  'PCI DSS': {
    'Req-1': 'Install and maintain a firewall configuration to protect cardholder data',
    'Req-2': 'Do not use vendor-supplied defaults for system passwords and other security parameters',
    'Req-3': 'Protect stored cardholder data',
    'Req-3.4': 'Render PAN unreadable anywhere it is stored',
    'Req-4': 'Encrypt transmission of cardholder data across open, public networks',
    'Req-5': 'Protect all systems against malware and regularly update antivirus software',
    'Req-6': 'Develop and maintain secure systems and applications',
    'Req-7': 'Restrict access to cardholder data by business need to know',
    'Req-8': 'Identify and authenticate access to system components',
    'Req-9': 'Restrict physical access to cardholder data',
    'Req-10': 'Track and monitor all access to network resources and cardholder data',
    'Req-11': 'Regularly test security systems and processes',
    'Req-12': 'Maintain a policy that addresses information security for all personnel',
  },
};

/**
 * Map keywords to compliance frameworks and controls
 */
const mapKeywordsToControls = (keywords: string[]): { frameworks: string[], controls: string[] } => {
  const frameworks: string[] = [];
  const controls: string[] = [];
  
  const keywordMappings: Record<string, { framework: string, controls: string[] }> = {
    'password': { framework: 'SOC 2', controls: ['CC6.1', 'CC6.2'] },
    'access control': { framework: 'SOC 2', controls: ['CC6.1'] },
    'encryption': { framework: 'PCI DSS', controls: ['Req-3.4', 'Req-4'] },
    'audit log': { framework: 'SOC 2', controls: ['CC7.2'] },
    'phi': { framework: 'HIPAA', controls: ['§164.308(a)(4)', '§164.312(a)'] },
    'medical': { framework: 'HIPAA', controls: ['§164.308(a)(4)', '§164.312(a)'] },
    'gdpr': { framework: 'GDPR', controls: ['Art. 5', 'Art. 25'] },
    'consent': { framework: 'GDPR', controls: ['Art. 7'] },
    'privacy': { framework: 'GDPR', controls: ['Art. 5', 'Art. 12', 'Art. 13', 'Art. 14'] },
    'cardholder': { framework: 'PCI DSS', controls: ['Req-3', 'Req-4'] },
    'payment': { framework: 'PCI DSS', controls: ['Req-3', 'Req-4'] },
    'soc': { framework: 'SOC 2', controls: [] },
    'hipaa': { framework: 'HIPAA', controls: [] },
    'pci': { framework: 'PCI DSS', controls: [] },
  };
  
  keywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    
    Object.entries(keywordMappings).forEach(([mappingKey, mapping]) => {
      if (lowerKeyword.includes(mappingKey)) {
        if (!frameworks.includes(mapping.framework)) {
          frameworks.push(mapping.framework);
        }
        
        mapping.controls.forEach(control => {
          if (!controls.includes(control)) {
            controls.push(control);
          }
        });
      }
    });
  });
  
  return { frameworks, controls };
};

/**
 * Calculate risk score based on issue data and compliance mapping
 */
const calculateRiskScore = (
  keywords: string[], 
  priority: string, 
  frameworks: string[]
): number => {
  let score = 0;
  
  // Base score from priority
  switch (priority) {
    case 'Highest':
    case 'Critical':
      score += 50;
      break;
    case 'High':
      score += 40;
      break;
    case 'Medium':
      score += 25;
      break;
    case 'Low':
      score += 10;
      break;
    case 'Lowest':
      score += 5;
      break;
  }
  
  // Add scores for frameworks
  if (frameworks.includes('SOC 2')) score += 15;
  if (frameworks.includes('HIPAA')) score += 20;
  if (frameworks.includes('PCI DSS')) score += 20;
  if (frameworks.includes('GDPR')) score += 15;
  
  // Add scores for keywords
  const highRiskKeywords = [
    'encryption', 'password', 'authentication', 'access', 'phi', 
    'cardholder', 'pci', 'hipaa', 'breach', 'vulnerability'
  ];
  
  keywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    if (highRiskKeywords.some(risk => lowerKeyword.includes(risk))) {
      score += 10;
    } else {
      score += 5;
    }
  });
  
  // Cap at 100
  return Math.min(100, score);
};

/**
 * Generate compliance framework statistics
 */
const getFrameworkStats = (): ComplianceFrameworkStats[] => {
  return [
    {
      framework: 'SOC 2',
      controlsWithIssues: 4,
      totalControls: Object.keys(frameworkControls['SOC 2']).length,
      percentageComplete: 71,
    },
    {
      framework: 'HIPAA',
      controlsWithIssues: 3,
      totalControls: Object.keys(frameworkControls['HIPAA']).length,
      percentageComplete: 82,
    },
    {
      framework: 'GDPR',
      controlsWithIssues: 5,
      totalControls: Object.keys(frameworkControls['GDPR']).length,
      percentageComplete: 67,
    },
    {
      framework: 'PCI DSS',
      controlsWithIssues: 2,
      totalControls: Object.keys(frameworkControls['PCI DSS']).length,
      percentageComplete: 85,
    },
  ];
};

export const complianceFrameworkService = {
  frameworkControls,
  mapKeywordsToControls,
  calculateRiskScore,
  getFrameworkStats,
};
