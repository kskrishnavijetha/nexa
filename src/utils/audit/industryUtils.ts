
import { Industry } from '@/utils/types';

/**
 * Maps lowercase industry names to proper Industry enum values
 */
export const mapToIndustryType = (name?: string): Industry | undefined => {
  if (!name) return undefined;
  
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('health') || lowerName.includes('medical') || lowerName.includes('hospital')) {
    return 'Healthcare';
  }
  if (lowerName.includes('bank') || lowerName.includes('finance') || lowerName.includes('payment')) {
    return 'Finance & Banking';
  }
  if (lowerName.includes('retail') || lowerName.includes('ecommerce') || lowerName.includes('shop')) {
    return 'E-commerce & Retail';
  }
  if (lowerName.includes('tech') || lowerName.includes('software') || lowerName.includes('cloud') || lowerName.includes('saas')) {
    return 'Cloud & SaaS';
  }
  if (lowerName.includes('gov') || lowerName.includes('public') || lowerName.includes('defense')) {
    return 'Government & Defense';
  }
  if (lowerName.includes('energy') || lowerName.includes('utilities') || lowerName.includes('power')) {
    return 'Energy & Utilities';
  }
  if (lowerName.includes('telecom') || lowerName.includes('communication')) {
    return 'Telecommunications';
  }
  if (lowerName.includes('manufacturing') || lowerName.includes('iot') || lowerName.includes('industrial')) {
    return 'Manufacturing & IoT';
  }
  if (lowerName.includes('education') || lowerName.includes('edtech') || lowerName.includes('school') || lowerName.includes('university')) {
    return 'Education & EdTech';
  }
  if (lowerName.includes('legal') || lowerName.includes('law') || lowerName.includes('consult')) {
    return 'Legal & Consulting';
  }
  if (lowerName.includes('insurance') || lowerName.includes('insure')) {
    return 'Insurance';
  }
  if (lowerName.includes('pharma') || lowerName.includes('life science') || lowerName.includes('pharmaceutical') || lowerName.includes('drug') || lowerName.includes('biotech')) {
    return 'Pharmaceutical & Life Sciences';
  }
  
  return undefined;
};
