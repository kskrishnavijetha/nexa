
/**
 * Generate a summary based on compliance scores
 */
export function generateSummary(overallScore: number, gdprScore: number, hipaaScore: number, pciDssScore: number): string {
  if (overallScore > 85) {
    return 'This document demonstrates a strong compliance posture overall, with only minor issues to address.';
  } else if (overallScore > 70) {
    return 'This document has several compliance areas that need improvement. The most critical issues relate to ' + 
      (gdprScore < 75 ? 'GDPR data subject rights' : '') + 
      (hipaaScore < 70 ? (gdprScore < 75 ? ' and ' : '') + 'HIPAA data encryption requirements' : '') +
      (pciDssScore < 75 ? (gdprScore < 75 || hipaaScore < 70 ? ' and ' : '') + 'PCI-DSS cardholder data protection' : '') + 
      '.';
  } else {
    return 'This document has significant compliance gaps that require immediate attention across multiple regulatory frameworks.';
  }
}
