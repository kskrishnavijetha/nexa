
// Export available compliance frameworks
export const complianceFrameworks = [
  'SOC 2',
  'GDPR',
  'HIPAA',
  'PCI DSS',
  'ISO 27001',
  'NIST CSF',
  'CCPA',
  'FERPA',
  'SOX',
  'GLBA',
  'NIST 800-53',
  'FISMA',
  'FedRAMP',
  'LGPD',
  'PIPEDA',
  'PDPA',
  'UK-GDPR',
  'ePrivacy Directive',
  'APRA CPS 234',
  'HITECH',
  'GDPR (Health Records)',
  'ISO 27799',
  'NHS DSP Toolkit',
  'MAS TRM Guidelines',
  'FINRA',
  'EMIR/MiFID II',
  'ISO 27017',
  'ISO 27018',
  'CIS Controls',
  'NIST Cybersecurity Framework (CSF)',
  'CSA CCM'
];

// Map regulations to compliance framework
export const regulationMapping: Record<string, Record<string, string[]>> = {
  'GDPR': {
    'Data Privacy': ['Art. 5', 'Art. 6', 'Art. 7'],
    'Access Control': ['Art. 25', 'Art. 32'],
    'Encryption': ['Art. 32'],
    'Logging': ['Art. 30', 'Art. 33'],
    'Data Protection': ['Art. 24', 'Art. 35', 'Art. 37-39']
  },
  'HIPAA': {
    'Data Privacy': ['§164.502', '§164.504', '§164.508'],
    'Access Control': ['§164.308(a)(3)', '§164.308(a)(4)', '§164.312(a)(1)'],
    'Encryption': ['§164.312(a)(2)(iv)', '§164.312(e)(2)(ii)'],
    'Logging': ['§164.308(a)(1)(ii)(D)', '§164.312(b)'],
    'Data Protection': ['§164.306', '§164.308']
  },
  'SOC 2': {
    'Data Privacy': ['Privacy-1', 'Privacy-2', 'Privacy-3'],
    'Access Control': ['CC6.1', 'CC6.2', 'CC6.3'],
    'Encryption': ['CC6.1', 'CC6.7'],
    'Logging': ['CC4.1', 'CC4.2', 'CC7.2'],
    'Data Protection': ['CC8.1', 'CC3.2', 'CC5.1']
  },
  'PCI DSS': {
    'Data Privacy': ['Req 3', 'Req 4'],
    'Access Control': ['Req 7', 'Req 8', 'Req 9'],
    'Encryption': ['Req 3.4', 'Req 4.1'],
    'Logging': ['Req 10', 'Req 10.7'],
    'Data Protection': ['Req 12', 'Req 6']
  },
  'ISO 27001': {
    'Data Privacy': ['A.18.1', 'A.18.2'],
    'Access Control': ['A.9', 'A.9.2', 'A.9.4'],
    'Encryption': ['A.10.1', 'A.14.1.3'],
    'Logging': ['A.12.4', 'A.12.4.1'],
    'Data Protection': ['A.8', 'A.18']
  },
  'NIST CSF': {
    'Data Privacy': ['PR.AC', 'PR.DS'],
    'Access Control': ['PR.AC', 'PR.PT'],
    'Encryption': ['PR.DS-1', 'PR.DS-5'],
    'Logging': ['DE.CM', 'DE.AE'],
    'Data Protection': ['PR.DS', 'PR.IP']
  },
  'NIST 800-53': {
    'Data Privacy': ['AC-3', 'AC-4', 'AC-6'],
    'Access Control': ['AC-1', 'AC-2', 'AC-3'],
    'Encryption': ['SC-13', 'SC-28'],
    'Logging': ['AU-2', 'AU-3', 'AU-6'],
    'Data Protection': ['SC-8', 'SC-13', 'MP-2']
  },
  'FISMA': {
    'Data Privacy': ['Privacy Controls', 'PL-4'],
    'Access Control': ['AC-1', 'AC-2', 'AC-3'],
    'Encryption': ['SC-13', 'SC-28'],
    'Logging': ['AU-2', 'AU-3', 'AU-6'],
    'Data Protection': ['SC-8', 'SC-13', 'MP-2']
  },
  'FedRAMP': {
    'Data Privacy': ['AC-21', 'AC-22'],
    'Access Control': ['AC-1', 'AC-2', 'AC-3'],
    'Encryption': ['SC-13', 'SC-28'],
    'Logging': ['AU-2', 'AU-3', 'AU-6'],
    'Data Protection': ['SC-8', 'SC-13', 'MP-2']
  },
  'LGPD': {
    'Data Privacy': ['Art. 7', 'Art. 8', 'Art. 9'],
    'Access Control': ['Art. 46', 'Art. 47'],
    'Encryption': ['Art. 46', 'Art. 50'],
    'Logging': ['Art. 37', 'Art. 38'],
    'Data Protection': ['Art. 46', 'Art. 47', 'Art. 48']
  },
  'PIPEDA': {
    'Data Privacy': ['Principle 3', 'Principle 4', 'Principle 5'],
    'Access Control': ['Principle 7', 'Principle 8'],
    'Encryption': ['Principle 7'],
    'Logging': ['Principle 7', 'Principle 9'],
    'Data Protection': ['Principle 7', 'Principle 9']
  },
  'PDPA': {
    'Data Privacy': ['Section 11', 'Section 12', 'Section 13'],
    'Access Control': ['Section 24', 'Section 25'],
    'Encryption': ['Section 24'],
    'Logging': ['Section 24', 'Section 35'],
    'Data Protection': ['Section 24', 'Section 25', 'Section 26']
  },
  'UK-GDPR': {
    'Data Privacy': ['Art. 5', 'Art. 6', 'Art. 7'],
    'Access Control': ['Art. 25', 'Art. 32'],
    'Encryption': ['Art. 32'],
    'Logging': ['Art. 30', 'Art. 33'],
    'Data Protection': ['Art. 24', 'Art. 35', 'Art. 37-39']
  },
  'ePrivacy Directive': {
    'Data Privacy': ['Art. 5', 'Art. 6', 'Art. 9'],
    'Access Control': ['Art. 4', 'Art. 5'],
    'Encryption': ['Art. 4'],
    'Logging': ['Art. 4', 'Art. 5'],
    'Data Protection': ['Art. 4', 'Art. 5', 'Art. 6']
  },
  'APRA CPS 234': {
    'Data Privacy': ['Para. 18', 'Para. 19'],
    'Access Control': ['Para. 16', 'Para. 17'],
    'Encryption': ['Para. 22', 'Para. 23'],
    'Logging': ['Para. 32', 'Para. 33'],
    'Data Protection': ['Para. 28', 'Para. 29', 'Para. 30']
  },
  'HITECH': {
    'Data Privacy': ['§13401', '§13402', '§13404'],
    'Access Control': ['§13401', '§13405'],
    'Encryption': ['§13401', '§13402'],
    'Logging': ['§13402', '§13405'],
    'Data Protection': ['§13401', '§13404', '§13405']
  },
  'GDPR (Health Records)': {
    'Data Privacy': ['Art. 9', 'Art. 17', 'Art. 20'],
    'Access Control': ['Art. 25', 'Art. 32'],
    'Encryption': ['Art. 32'],
    'Logging': ['Art. 30', 'Art. 33'],
    'Data Protection': ['Art. 9', 'Art. 32', 'Art. 35']
  },
  'ISO 27799': {
    'Data Privacy': ['5.4', '5.6', '7.8'],
    'Access Control': ['7.8', '7.11'],
    'Encryption': ['7.10', '7.12'],
    'Logging': ['7.11', '7.13'],
    'Data Protection': ['7.8', '7.9', '7.12']
  },
  'NHS DSP Toolkit': {
    'Data Privacy': ['1.3', '1.4', '1.5'],
    'Access Control': ['4.1', '4.2', '4.3'],
    'Encryption': ['9.1', '9.2', '9.3'],
    'Logging': ['7.1', '7.2', '7.3'],
    'Data Protection': ['8.1', '8.2', '8.3']
  },
  'MAS TRM Guidelines': {
    'Data Privacy': ['Section 5', 'Section 6'],
    'Access Control': ['Section 9', 'Section 10'],
    'Encryption': ['Section 11', 'Section 12'],
    'Logging': ['Section 13', 'Section 14'],
    'Data Protection': ['Section 15', 'Section 16', 'Section 17']
  },
  'FINRA': {
    'Data Privacy': ['Rule 2010', 'Rule 3110'],
    'Access Control': ['Rule 4511', 'Rule 4513'],
    'Encryption': ['Rule 4370', 'Notice 05-48'],
    'Logging': ['Rule 3110', 'Rule 4511'],
    'Data Protection': ['Rule 2010', 'Rule 3110', 'Rule 4511']
  },
  'EMIR/MiFID II': {
    'Data Privacy': ['Art. 9', 'Art. 16'],
    'Access Control': ['Art. 21', 'Art. 25'],
    'Encryption': ['Art. 16', 'Art. 25'],
    'Logging': ['Art. 16', 'Art. 17', 'Art. 25'],
    'Data Protection': ['Art. 16', 'Art. 21', 'Art. 25']
  },
  'ISO 27017': {
    'Data Privacy': ['CLD.6.3', 'CLD.8.1'],
    'Access Control': ['CLD.9.2', 'CLD.9.5'],
    'Encryption': ['CLD.10.1', 'CLD.10.2'],
    'Logging': ['CLD.12.4', 'CLD.13.1'],
    'Data Protection': ['CLD.8.1', 'CLD.13.1', 'CLD.13.2']
  },
  'ISO 27018': {
    'Data Privacy': ['A.2', 'A.3', 'A.5'],
    'Access Control': ['A.9', 'A.10'],
    'Encryption': ['A.10', 'A.11'],
    'Logging': ['A.12', 'A.13'],
    'Data Protection': ['A.8', 'A.10', 'A.11']
  },
  'CIS Controls': {
    'Data Privacy': ['Control 13', 'Control 14'],
    'Access Control': ['Control 5', 'Control 6'],
    'Encryption': ['Control 10', 'Control 15'],
    'Logging': ['Control 8', 'Control 9'],
    'Data Protection': ['Control 3', 'Control 13', 'Control 15']
  },
  'CSA CCM': {
    'Data Privacy': ['DCS-07', 'DCS-08', 'DCS-09'],
    'Access Control': ['IAM-01', 'IAM-02', 'IAM-03'],
    'Encryption': ['CEK-01', 'CEK-02', 'CEK-03'],
    'Logging': ['LOG-01', 'LOG-02', 'LOG-03'],
    'Data Protection': ['DSP-01', 'DSP-02', 'DSP-03']
  },
  'CCPA': {
    'Data Privacy': ['§1798.100', '§1798.105', '§1798.110'],
    'Access Control': ['§1798.115', '§1798.120'],
    'Encryption': ['§1798.150'],
    'Logging': ['§1798.130', '§1798.135'],
    'Data Protection': ['§1798.140', '§1798.145']
  },
  'FERPA': {
    'Data Privacy': ['§99.30', '§99.31'],
    'Access Control': ['§99.31', '§99.32'],
    'Encryption': ['§99.30', '§99.31(a)(9)'],
    'Logging': ['§99.32', '§99.34'],
    'Data Protection': ['§99.35', '§99.36', '§99.37']
  },
  'SOX': {
    'Data Privacy': ['§404', '§302'],
    'Access Control': ['§404', '§302'],
    'Encryption': ['§404', '§302'],
    'Logging': ['§404', '§302', '§409'],
    'Data Protection': ['§404', '§302', '§802']
  },
  'GLBA': {
    'Data Privacy': ['§6801', '§6802'],
    'Access Control': ['§6801', '§6805'],
    'Encryption': ['§6801'],
    'Logging': ['§6801', '§6805'],
    'Data Protection': ['§6801', '§6802', '§6803']
  }
};

// Generate a compliance status based on risk score
export const determineComplianceStatus = (overallScore: number): 'Compliant' | 'Needs Remediation' | 'Critical' => {
  if (overallScore >= 90) return 'Compliant';
  if (overallScore >= 70) return 'Needs Remediation';
  return 'Critical';
};

// Calculate estimated time to fix based on severity and number of issues
export const calculateEstimatedTimeToFix = (severity: string, count: number): string => {
  let baseTime: number;
  
  switch (severity.toLowerCase()) {
    case 'high':
      baseTime = 16;
      break;
    case 'medium':
      baseTime = 8;
      break;
    case 'low':
      baseTime = 4;
      break;
    default:
      baseTime = 2;
  }
  
  const totalHours = baseTime * count;
  
  if (totalHours >= 40) {
    return `${Math.round(totalHours / 8)} work days`;
  } else {
    return `${totalHours} hours`;
  }
};

// Generate a matrix of compliance checks
export const generateComplianceMatrix = (
  framework: string, 
  auditEvents: any[], 
  documentName: string
) => {
  const categories = [
    'Data Privacy',
    'Access Control',
    'Encryption',
    'Logging',
    'Data Protection'
  ];
  
  // Get the mapping for the selected framework
  const frameworkMappings = regulationMapping[framework] || {};
  
  const matrix = categories.map(category => {
    // Determine if there are issues in this category based on audit events
    const hasIssues = auditEvents.some(event => 
      event.action.toLowerCase().includes(category.toLowerCase()) && 
      event.action.toLowerCase().includes('violation')
    );
    
    // Get regulations for this category from the mapping
    const regulations = frameworkMappings[category] || ['General Requirement'];
    
    return {
      category,
      regulations: regulations.join(', '),
      status: hasIssues ? 'Warning' : 'Pass',
      explanation: hasIssues 
        ? `Potential compliance issues found in ${category} section for ${documentName}` 
        : `No issues detected in ${category} section for ${documentName}`,
      severity: hasIssues ? 'Medium' : 'Low'
    };
  });
  
  // Add a random critical issue for demonstration purposes
  const randomIndex = Math.floor(Math.random() * categories.length);
  if (randomIndex < matrix.length) {
    matrix[randomIndex].status = 'Fail';
    matrix[randomIndex].severity = 'High';
    matrix[randomIndex].explanation = `Critical compliance violation found in ${matrix[randomIndex].category}. Immediate remediation required.`;
  }
  
  return matrix;
};
