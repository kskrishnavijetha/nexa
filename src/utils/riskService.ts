
// Import and re-export from risk module
import { generateRisks } from './risk';
import { Risk, Suggestion } from './types';

/**
 * Performs real-time risk assessment based on content
 */
export const assessContentRisk = (content: string, regulations: string[]): Risk[] => {
  if (!content || content.length === 0) {
    return [];
  }

  const risks: Risk[] = [];
  const contentLower = content.toLowerCase();
  
  // Check for personally identifiable information
  if (contentLower.match(/\b(?:ssn|social security|passport|driver license)\b/)) {
    risks.push({
      id: `risk-${Date.now()}-1`,
      title: 'PII Detection',
      description: 'Personally identifiable information detected',
      severity: 'high',
      regulation: 'GDPR',
      mitigation: 'Encrypt or remove personal data identifiers'
    });
  }

  // Check for health information if HIPAA is in regulations
  if (regulations.includes('HIPAA') && 
      contentLower.match(/\b(?:patient|health|medical|diagnosis|treatment)\b/)) {
    risks.push({
      id: `risk-${Date.now()}-2`,
      title: 'PHI Detected',
      description: 'Protected health information found',
      severity: 'high',
      regulation: 'HIPAA',
      mitigation: 'Implement proper PHI handling protocols'
    });
  }

  // Check for financial information if PCI-DSS is in regulations
  if (regulations.includes('PCI-DSS') && 
      contentLower.match(/\b(?:credit card|card number|cvv|expiration)\b/)) {
    risks.push({
      id: `risk-${Date.now()}-3`,
      title: 'Payment Card Data',
      description: 'Unsecured payment card information detected',
      severity: 'high',
      regulation: 'PCI-DSS',
      mitigation: 'Remove or encrypt payment card information'
    });
  }

  return risks;
};

/**
 * Generates compliance suggestions based on identified risks
 */
export const generateSuggestions = (risks: Risk[]): Suggestion[] => {
  if (risks.length === 0) {
    return [];
  }

  const suggestions: Suggestion[] = risks.map(risk => ({
    id: `suggestion-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    title: `Address ${risk.title}`,
    description: risk.mitigation,
    priority: risk.severity === 'high' ? 'high' : 
              risk.severity === 'medium' ? 'medium' : 'low'
  }));

  // Add general suggestion if high severity risks are found
  if (risks.some(risk => risk.severity === 'high')) {
    suggestions.push({
      id: `suggestion-${Date.now()}-general`,
      title: 'Conduct Thorough Review',
      description: 'High severity issues found. Consider a complete compliance review.',
      priority: 'high'
    });
  }

  return suggestions;
};

/**
 * Monitors real-time content changes and assesses for risks
 */
export const setupRealTimeMonitoring = (
  contentProvider: () => string,
  regulations: string[],
  onRisksDetected: (risks: Risk[]) => void,
  onSuggestionsGenerated: (suggestions: Suggestion[]) => void,
  interval = 5000
): () => void => {
  const intervalId = setInterval(() => {
    const currentContent = contentProvider();
    const risks = assessContentRisk(currentContent, regulations);
    
    onRisksDetected(risks);
    
    const suggestions = generateSuggestions(risks);
    onSuggestionsGenerated(suggestions);
  }, interval);

  // Return cleanup function
  return () => clearInterval(intervalId);
};

// Export the generateRisks function from risk module
export { generateRisks };
