
import { Region, REGION_REGULATIONS, Suggestion } from './types';

// Region-specific suggestion texts
const REGION_SUGGESTIONS: Record<string, string[]> = {
  'North America': ['Implement CCPA-compliant cookie consent mechanism', 'Develop a clear data subject rights procedure'],
  'Europe': ['Ensure GDPR-compliant data processing agreements are in place', 'Document all data processing activities in a registry'],
  'Asia Pacific': ['Appoint a data protection officer', 'Implement cross-border data transfer safeguards'],
  'United Kingdom': ['Conduct a legitimate interest assessment', 'Implement a cookie consent mechanism'],
  'Latin America': ['Establish a data subject rights procedure', 'Document the legal basis for processing'],
  'Middle East': ['Implement consent mechanisms for personal data', 'Establish a data breach notification procedure'],
  'Africa': ['Document data processing activities', 'Implement security safeguards']
};

/**
 * Generate compliance suggestions based on regulations and region
 */
export function generateSuggestions(regulations: string[] = [], region?: Region): Suggestion[] {
  let suggestionsText: string[] = [];
  
  // Add general suggestions based on regulations
  if (regulations.includes('GDPR') || regulations.length === 0) {
    suggestionsText.push('Review and update privacy policies to comply with GDPR.');
  }
  
  if (regulations.includes('HIPAA') || regulations.length === 0) {
    suggestionsText.push('Implement stronger access controls to protect PHI.');
  }
  
  if (regulations.includes('SOC 2') || regulations.length === 0) {
    suggestionsText.push('Enhance security monitoring and incident response.');
  }
  
  // Add region-specific suggestions
  if (region && REGION_SUGGESTIONS[region]) {
    suggestionsText = [...suggestionsText, ...REGION_SUGGESTIONS[region]];
  }
  
  // Convert string suggestions to Suggestion objects
  return suggestionsText.map((text, index) => ({
    id: `suggestion-${index + 1}`,
    title: text.split('.')[0],
    description: text
  }));
}
