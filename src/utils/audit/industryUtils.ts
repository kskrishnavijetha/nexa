
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
  if (lowerName.includes('tech') || lowerName.includes('software') || lowerName.includes('cloud')) {
    return 'Cloud & SaaS';
  }
  if (lowerName.includes('gov') || lowerName.includes('public')) {
    return 'Government & Defense';
  }
  
  return undefined;
};
