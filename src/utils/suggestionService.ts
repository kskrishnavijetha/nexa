
/**
 * Industry-specific suggestions mapping
 */
const INDUSTRY_SUGGESTIONS: Record<string, string[]> = {
  'HIPAA': [
    'Implement a comprehensive PHI tracking system',
    'Conduct annual HIPAA training for all staff members',
    'Develop a formal BAA management process for vendor relationships'
  ],
  'GDPR': [
    'Create a data retention policy that clearly specifies storage durations for all personal data',
    'Establish a formal process for handling data subject access requests with defined timelines',
    'Implement a data protection impact assessment (DPIA) process for new initiatives'
  ],
  'PCI-DSS': [
    'Implement network segmentation to isolate cardholder data environment',
    'Enhance encryption standards for stored cardholder data',
    'Establish regular vulnerability scanning and penetration testing'
  ],
  'SOC 2': [
    'Update access control policies to follow the principle of least privilege',
    'Implement a formal risk assessment process',
    'Document incident response procedures'
  ],
  'ISO/IEC 27001': [
    'Develop comprehensive information security policies',
    'Implement a risk assessment methodology',
    'Establish security awareness training for all employees'
  ],
  'FERPA': [
    'Implement strict access controls for student education records',
    'Develop a process for obtaining consent before disclosing identifiable information',
    'Conduct regular FERPA compliance training for staff'
  ],
  'FISMA': [
    'Implement continuous monitoring of security controls',
    'Enhance security assessment procedures',
    'Document system security plans for all information systems'
  ],
  'FDA': [
    'Establish comprehensive documentation for quality control procedures',
    'Implement a formal change control process',
    'Develop validation protocols for equipment and processes'
  ],
  'ISO 14001': [
    'Establish a formal environmental management system',
    'Develop procedures for identifying environmental aspects and impacts',
    'Implement environmental performance monitoring and measurement'
  ]
};

// General suggestions that apply to most regulations
const GENERAL_SUGGESTIONS = [
  'Implement strong encryption for all sensitive data using industry-standard algorithms',
  'Document and implement a formal incident response plan',
  'Establish regular compliance training for all relevant staff',
  'Implement a document control system to manage policy and procedure updates',
  'Develop a formal risk assessment methodology and schedule'
];

/**
 * Generate improvement suggestions for compliance based on applicable regulations
 */
export function generateSuggestions(regulations: string[] = []): string[] {
  const suggestions: string[] = [...GENERAL_SUGGESTIONS];
  
  // Add industry-specific suggestions
  regulations.forEach(regulation => {
    if (INDUSTRY_SUGGESTIONS[regulation]) {
      // Get a random subset of industry suggestions
      const industrySuggestions = INDUSTRY_SUGGESTIONS[regulation];
      const randomCount = Math.min(2, industrySuggestions.length);
      
      // Shuffle array to get random suggestions
      const shuffled = [...industrySuggestions].sort(() => 0.5 - Math.random());
      
      // Take the first n items
      suggestions.push(...shuffled.slice(0, randomCount));
    }
  });
  
  // Return a unique set of suggestions (up to 8 total)
  return [...new Set(suggestions)].slice(0, 8);
}
