import { Industry } from '@/utils/types';

/**
 * Maps lowercase industry names to proper Industry enum values
 */
export const mapToIndustryType = (name?: string): Industry | undefined => {
  if (!name) return undefined;
  
  const lowerName = name.toLowerCase();
  
  // Finance & Banking detection
  if (lowerName.includes('finance') || 
      lowerName.includes('bank') || 
      lowerName.includes('financial') ||
      lowerName.includes('investment') ||
      lowerName.includes('trading')) {
    return 'Finance & Banking';
  }
  
  // Healthcare detection
  if (lowerName.includes('health') || 
      lowerName.includes('medical') || 
      lowerName.includes('hospital') || 
      lowerName.includes('patient') || 
      lowerName.includes('clinic') ||
      lowerName.includes('doctor') ||
      lowerName.includes('care') ||
      lowerName.includes('hipaa')) {
    return 'Healthcare';
  }
  
  // Other industries
  if (lowerName.includes('retail') || lowerName.includes('consumer') || lowerName.includes('store')) {
    return 'Retail & Consumer';
  }
  if (lowerName.includes('commerce') || lowerName.includes('ecommerce') || lowerName.includes('shop')) {
    return 'E-Commerce';
  }
  if (lowerName.includes('tech') || lowerName.includes('software') || lowerName.includes('cloud') || 
      lowerName.includes('saas')) {
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
  if (lowerName.includes('manufacturing') || lowerName.includes('supply')) {
    return 'Manufacturing & Supply Chain';
  }
  if (lowerName.includes('education') || lowerName.includes('school') || lowerName.includes('university')) {
    return 'Education';
  }
  if (lowerName.includes('auto') || lowerName.includes('car') || lowerName.includes('vehicle')) {
    return 'Automotive';
  }
  if (lowerName.includes('pharma') || lowerName.includes('bio') || lowerName.includes('drug')) {
    return 'Pharmaceutical & Biotech';
  }
  
  return undefined;
};

/**
 * Extract industry from document content
 */
export const extractIndustryFromContent = (content: string): Industry | undefined => {
  const lowerContent = content.toLowerCase();
  
  // First check for Finance & Banking
  if (lowerContent.includes('bank') || 
      lowerContent.includes('financial') || 
      lowerContent.includes('investment') ||
      lowerContent.includes('trading') ||
      lowerContent.includes('finance')) {
    return 'Finance & Banking';
  }
  
  // Then check for Healthcare
  if (lowerContent.includes('health') || 
      lowerContent.includes('medical') || 
      lowerContent.includes('patient') ||
      lowerContent.includes('hipaa') ||
      lowerContent.includes('clinic')) {
    return 'Healthcare';
  }
  
  // Check other industries with specific keywords
  const industryKeywords: Record<Industry, string[]> = {
    'Finance & Banking': ['bank', 'financial', 'investment', 'trading', 'finance'],
    'Healthcare': ['health', 'medical', 'patient', 'hipaa', 'clinic'],
    'Retail & Consumer': ['retail', 'consumer', 'store', 'shop'],
    'E-Commerce': ['ecommerce', 'online store', 'marketplace'],
    'Cloud & SaaS': ['cloud', 'software', 'saas', 'platform'],
    'Government & Defense': ['government', 'defense', 'public', 'federal'],
    'Energy & Utilities': ['energy', 'utility', 'power', 'electric'],
    'Telecom': ['telecom', 'communication', 'network'],
    'Manufacturing & Supply Chain': ['manufacturing', 'factory', 'supply chain'],
    'Education': ['education', 'school', 'university', 'academic'],
    'Automotive': ['automotive', 'car', 'vehicle', 'motor'],
    'Pharmaceutical & Biotech': ['pharmaceutical', 'biotech', 'drug'],
    'Global': ['global', 'international', 'worldwide']
  };

  // Count keyword matches for each industry
  const industryCounts = Object.entries(industryKeywords).map(([industry, keywords]) => {
    const count = keywords.reduce((total, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = lowerContent.match(regex);
      return total + (matches ? matches.length : 0);
    }, 0);
    return { industry: industry as Industry, count };
  });

  // Sort by count and return the industry with most matches
  industryCounts.sort((a, b) => b.count - a.count);
  return industryCounts[0]?.count > 0 ? industryCounts[0].industry : undefined;
};
