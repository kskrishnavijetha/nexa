
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
  'GLBA'
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
