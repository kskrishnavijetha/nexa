
import { Industry, Region } from './types';
import { SupportedLanguage, translate } from './languageService';

/**
 * Generate a human-readable summary based on compliance scores
 */
export function generateSummary(
  overallScore: number, 
  gdprScore: number, 
  hipaaScore: number, 
  pciDssScore: number, 
  industry?: Industry,
  language: SupportedLanguage = 'en',
  region?: Region
): string {
  let summary = '';
  
  // Start with the introduction, now with more emphasis on industry context
  if (industry) {
    summary = `${translate('based_on_analysis', language)} ${industry} ${translate('industry_compliance', language)} `;
  } else {
    summary = `${translate('based_on_analysis', language)} ${translate('industry_compliance', language)} `;
  }
  
  // Add region-specific context if available
  if (region) {
    const regionText = getRegionText(region, language);
    summary += `${regionText} `;
  }
  
  // Add score-based assessment
  if (overallScore >= 85) {
    summary += translate('strong_compliance', language);
  } else if (overallScore >= 70) {
    summary += translate('needs_improvement', language);
    
    // Add details about the most problematic areas
    const lowestScore = Math.min(gdprScore, hipaaScore, pciDssScore || 100);
    if (lowestScore === gdprScore) {
      summary += ` GDPR (${gdprScore}%).`;
    } else if (lowestScore === hipaaScore) {
      summary += ` HIPAA (${hipaaScore}%).`;
    } else if (pciDssScore && lowestScore === pciDssScore) {
      summary += ` PCI-DSS (${pciDssScore}%).`;
    } else {
      summary += '.';
    }
  } else {
    summary += translate('significant_gaps', language);
  }
  
  // Add region-specific compliance information if available
  if (region) {
    summary += ' ' + getRegionComplianceSummary(region, overallScore, language);
  }
  
  // Add industry-specific insights if applicable
  if (industry) {
    summary += ' ' + getIndustrySpecificInsight(industry, language);
  }
  
  return summary;
}

/**
 * Get region-specific text for the introduction
 */
function getRegionText(region: Region, language: SupportedLanguage = 'en'): string {
  if (language === 'en') {
    return `with a focus on ${region} regulatory requirements,`;
  } else if (language === 'es') {
    return `con enfoque en los requisitos regulatorios de ${region},`;
  } else if (language === 'fr') {
    return `en mettant l'accent sur les exigences réglementaires de ${region},`;
  } else if (language === 'de') {
    return `mit Fokus auf regulatorische Anforderungen in ${region},`;
  } else if (language === 'zh') {
    return `重点关注${region}的监管要求，`;
  }
  return `with a focus on ${region} regulatory requirements,`;
}

/**
 * Get region-specific compliance summary
 */
function getRegionComplianceSummary(region: Region, score: number, language: SupportedLanguage = 'en'): string {
  if (language !== 'en') {
    // For simplicity, only English is fully implemented
    return '';
  }
  
  switch (region) {
    case 'North America':
      return score >= 80 
        ? `Your document shows good alignment with North American regulations like CCPA and HIPAA.`
        : `Your document needs improvements to fully comply with North American regulations like CCPA and HIPAA.`;
    case 'European Union':
      return score >= 80 
        ? `Your document shows good alignment with EU regulations including GDPR.`
        : `Your document needs significant updates to meet EU GDPR requirements.`;
    case 'Asia Pacific':
      return score >= 80 
        ? `Your document appears to address the varied data protection regulations across the Asia Pacific region.`
        : `Your document requires updates to address the diverse regulatory landscape in Asia Pacific.`;
    case 'United Kingdom':
      return score >= 80 
        ? `Your document appears to be well-aligned with UK regulations including UK GDPR and PECR.`
        : `Your document requires updates to comply with post-Brexit UK data protection laws.`;
    case 'Latin America':
      return score >= 80 
        ? `Your document shows good compliance with Latin American data protection laws like LGPD.`
        : `Your document needs updates to address Latin American data protection requirements like LGPD.`;
    case 'Middle East':
      return score >= 80 
        ? `Your document addresses the key requirements of Middle Eastern data protection frameworks.`
        : `Your document needs to better address Middle Eastern data protection requirements.`;
    case 'Africa':
      return score >= 80 
        ? `Your document appears to align well with African data protection regulations like POPIA.`
        : `Your document needs improvements to address African data protection laws like POPIA.`;
    default:
      return '';
  }
}

/**
 * Get industry-specific compliance insight
 */
function getIndustrySpecificInsight(industry: Industry, language: SupportedLanguage = 'en'): string {
  // Implementation left simple for brevity
  if (language !== 'en') {
    return '';
  }
  
  switch (industry) {
    case 'Healthcare':
      return 'Pay special attention to patient data protection and medical record handling requirements.';
    case 'Finance & Banking':
      return 'Focus on financial data security and transaction integrity requirements.';
    case 'Cloud & SaaS':
      return 'Consider data processing agreements and security controls for digital services.';
    case 'E-Commerce':
      return 'Ensure customer data protection and payment processing security are properly addressed.';
    case 'Government & Defense':
      return 'Address the stringent security and data handling requirements specific to government operations.';
    case 'Telecom':
      return 'Focus on customer data protection and communication privacy regulations.';
    case 'Retail & Consumer':
      return 'Prioritize consumer data protection and privacy consent management.';
    case 'Education':
      return 'Address student data privacy concerns and educational record protection requirements.';
    case 'Energy & Utilities':
      return 'Focus on critical infrastructure protection and operational data security.';
    default:
      return '';
  }
}
