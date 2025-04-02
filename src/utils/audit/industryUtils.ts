
import { Industry } from '@/utils/types';

/**
 * Maps lowercase industry names to proper Industry enum values
 */
export const mapToIndustryType = (name?: string): Industry | undefined => {
  if (!name) return undefined;
  
  const lowerName = name.toLowerCase();
  
  // Healthcare should be matched first as it's more specific
  if (lowerName.includes('health') || lowerName.includes('medical') || lowerName.includes('hospital') || 
      lowerName.includes('clinic') || lowerName.includes('patient') || lowerName.includes('care')) {
    return 'Healthcare';
  }
  if (lowerName.includes('bank') || lowerName.includes('finance') || lowerName.includes('payment') || 
      lowerName.includes('invest') || lowerName.includes('loan')) {
    return 'Finance & Banking';
  }
  if (lowerName.includes('retail') || lowerName.includes('consumer') || lowerName.includes('store')) {
    return 'Retail & Consumer';
  }
  if (lowerName.includes('commerce') || lowerName.includes('ecommerce') || lowerName.includes('shop') || 
      lowerName.includes('online store')) {
    return 'E-Commerce';
  }
  if (lowerName.includes('tech') || lowerName.includes('software') || lowerName.includes('cloud') || 
      lowerName.includes('saas') || lowerName.includes('service')) {
    return 'Cloud & SaaS';
  }
  if (lowerName.includes('gov') || lowerName.includes('public') || lowerName.includes('defense') || 
      lowerName.includes('federal') || lowerName.includes('agency')) {
    return 'Government & Defense';
  }
  if (lowerName.includes('energy') || lowerName.includes('utilities') || lowerName.includes('power') || 
      lowerName.includes('electric')) {
    return 'Energy & Utilities';
  }
  if (lowerName.includes('telecom') || lowerName.includes('communication') || lowerName.includes('network')) {
    return 'Telecom';
  }
  if (lowerName.includes('manufacturing') || lowerName.includes('supply') || lowerName.includes('industrial') || 
      lowerName.includes('factory')) {
    return 'Manufacturing & Supply Chain';
  }
  if (lowerName.includes('education') || lowerName.includes('school') || lowerName.includes('university') || 
      lowerName.includes('college') || lowerName.includes('academy')) {
    return 'Education';
  }
  if (lowerName.includes('auto') || lowerName.includes('car') || lowerName.includes('vehicle') || 
      lowerName.includes('motor')) {
    return 'Automotive';
  }
  if (lowerName.includes('pharma') || lowerName.includes('bio') || lowerName.includes('drug') || 
      lowerName.includes('med') || lowerName.includes('therapeutic')) {
    return 'Pharmaceutical & Biotech';
  }
  
  return undefined;
};

/**
 * Extract industry from document content based on keywords
 * This is a backup method if the document name doesn't provide enough context
 */
export const extractIndustryFromContent = (content: string): Industry | undefined => {
  const lowerContent = content.toLowerCase();
  
  const industryKeywords: Record<Industry, string[]> = {
    'Healthcare': ['patient', 'health', 'medical', 'hipaa', 'hospital', 'clinical', 'treatment'],
    'Finance & Banking': ['bank', 'financial', 'credit', 'loan', 'investment', 'transaction', 'payment'],
    'Cloud & SaaS': ['cloud', 'software', 'service', 'platform', 'subscription', 'api', 'hosting'],
    'E-Commerce': ['shop', 'store', 'cart', 'checkout', 'product', 'order', 'customer'],
    'Telecom': ['telecommunication', 'broadband', 'network', 'wireless', 'cellular', 'bandwidth'],
    'Energy & Utilities': ['energy', 'power', 'utility', 'electricity', 'gas', 'water', 'grid'],
    'Retail & Consumer': ['retail', 'consumer', 'merchandise', 'inventory', 'sale', 'discount'],
    'Education': ['student', 'school', 'university', 'education', 'academic', 'learning', 'course'],
    'Government & Defense': ['government', 'defense', 'public', 'agency', 'compliance', 'federal', 'security'],
    'Pharmaceutical & Biotech': ['pharmaceutical', 'drug', 'clinical', 'biotech', 'therapeutic', 'fda', 'medicine'],
    'Manufacturing & Supply Chain': ['manufacturing', 'factory', 'production', 'supply chain', 'inventory', 'logistics'],
    'Automotive': ['automotive', 'vehicle', 'car', 'motor', 'transport', 'driver', 'safety'],
    'Global': ['global', 'international', 'worldwide', 'multinational']
  };
  
  // Check each industry by counting keyword occurrences
  const industryCounts = Object.entries(industryKeywords).map(([industry, keywords]) => {
    const count = keywords.reduce((total, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = lowerContent.match(regex);
      return total + (matches ? matches.length : 0);
    }, 0);
    return { industry: industry as Industry, count };
  });
  
  // Sort by keyword count, descending
  industryCounts.sort((a, b) => b.count - a.count);
  
  // Return the industry with the most keyword matches, if any
  return industryCounts[0]?.count > 0 ? industryCounts[0].industry : undefined;
};
