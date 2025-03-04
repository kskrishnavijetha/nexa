
/**
 * Generate improvement suggestions for compliance
 */
export function generateSuggestions(): string[] {
  return [
    'Implement a data retention policy that clearly specifies storage durations for all personal data',
    'Establish a formal process for handling data subject access requests with defined timelines',
    'Enhance physical safeguards documentation to include detailed security measures',
    'Implement strong encryption for all sensitive data using industry-standard algorithms',
    'Update access control policies to follow the principle of least privilege',
    'Implement network segmentation to isolate cardholder data environment',
    'Conduct regular vulnerability scanning and penetration testing',
    'Document and implement a formal incident response plan'
  ];
}
