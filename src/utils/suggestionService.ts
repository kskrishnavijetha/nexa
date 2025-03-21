
import { Region, REGION_REGULATIONS } from './types';

// Region-specific suggestion templates
const REGION_SUGGESTIONS: Record<Region, string[]> = {
  'North America': [
    'Implement a "Do Not Sell My Personal Information" link on your website as required by CCPA',
    'Develop a comprehensive data inventory that tracks personal information as defined by US privacy laws',
    'Ensure your privacy policy meets both CCPA and CPRA requirements',
    'Create a process for honoring data subject access requests within the required timeframe'
  ],
  'European Union': [
    'Conduct Data Protection Impact Assessments for high-risk processing activities',
    'Review and update data processing agreements with all processors',
    'Implement technical measures to ensure data minimization',
    'Establish procedures for international data transfers that comply with EU requirements'
  ],
  'Asia Pacific': [
    'Appoint data protection officers where required by regional laws',
    'Implement region-specific consent mechanisms for data processing',
    'Create localized privacy notices compliant with APPI and PIPL',
    'Develop cross-border data transfer mechanisms compliant with Asian data protection laws'
  ],
  'United Kingdom': [
    'Update privacy policies to reflect UK GDPR requirements',
    'Implement cookie consent mechanisms compliant with PECR',
    'Conduct legitimate interest assessments for relevant processing activities',
    'Review international transfer mechanisms post-Brexit'
  ],
  'Latin America': [
    'Implement appropriate legal bases for data processing under LGPD',
    'Create a data subject rights fulfillment process compliant with Latin American laws',
    'Develop specific privacy notices for Brazilian, Mexican, and Argentinian users',
    'Establish a data breach notification process that meets regional requirements'
  ],
  'Middle East': [
    'Implement explicit consent mechanisms for personal data collection',
    'Establish data localization processes where required by Middle Eastern laws',
    'Create a comprehensive data retention policy that meets regional requirements',
    'Develop procedures for cross-border data transfers'
  ],
  'Africa': [
    'Implement documentation for all processing activities as required by POPIA',
    'Create a comprehensive information security framework',
    'Establish procedures for obtaining consent that comply with African data protection laws',
    'Develop a privacy program that meets the requirements of POPIA and NDPR'
  ]
};

/**
 * Generate compliance improvement suggestions
 */
export function generateSuggestions(regulations: string[] = [], region?: Region): string[] {
  const suggestions: string[] = [];
  
  // Add general suggestions
  suggestions.push('Implement regular compliance training for all staff');
  suggestions.push('Conduct periodic internal compliance audits');
  
  // Add GDPR-specific suggestions if applicable
  if (regulations.includes('GDPR')) {
    suggestions.push('Conduct a Data Protection Impact Assessment (DPIA) for high-risk processing activities');
    suggestions.push('Review and update your data processing agreements with all processors');
  }
  
  // Add HIPAA-specific suggestions if applicable
  if (regulations.includes('HIPAA')) {
    suggestions.push('Implement technical safeguards for all systems containing PHI');
    suggestions.push('Conduct a comprehensive risk analysis of PHI handling procedures');
  }
  
  // Add SOC 2-specific suggestions if applicable
  if (regulations.includes('SOC 2')) {
    suggestions.push('Implement a formal risk assessment process');
    suggestions.push('Enhance access control measures across all systems');
  }
  
  // Add PCI-DSS specific suggestions if applicable
  if (regulations.includes('PCI-DSS')) {
    suggestions.push('Implement network segmentation for cardholder data environment');
    suggestions.push('Enhance encryption standards for stored cardholder data');
  }
  
  // Add region-specific suggestions if applicable
  if (region && REGION_SUGGESTIONS[region]) {
    // Add 2-3 random region-specific suggestions
    const regionSuggestions = REGION_SUGGESTIONS[region];
    const shuffled = [...regionSuggestions].sort(() => 0.5 - Math.random());
    suggestions.push(...shuffled.slice(0, Math.min(3, regionSuggestions.length)));
  }
  
  return suggestions;
}
