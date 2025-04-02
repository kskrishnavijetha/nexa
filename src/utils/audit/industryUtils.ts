
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
  if (lowerName.includes('retail') || lowerName.includes('consumer')) {
    return 'Retail & Consumer';
  }
  if (lowerName.includes('commerce') || lowerName.includes('ecommerce') || lowerName.includes('shop')) {
    return 'E-Commerce';
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
    return 'Telecom';
  }
  if (lowerName.includes('manufacturing') || lowerName.includes('supply') || lowerName.includes('industrial')) {
    return 'Manufacturing & Supply Chain';
  }
  if (lowerName.includes('education') || lowerName.includes('school') || lowerName.includes('university')) {
    return 'Education';
  }
  if (lowerName.includes('auto') || lowerName.includes('car') || lowerName.includes('vehicle')) {
    return 'Automotive';
  }
  if (lowerName.includes('pharma') || lowerName.includes('bio') || lowerName.includes('drug') || lowerName.includes('med')) {
    return 'Pharmaceutical & Biotech';
  }
  
  return undefined;
};
