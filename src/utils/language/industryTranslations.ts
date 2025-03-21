
import { Industry } from '../types';
import { SupportedLanguage } from './types';
import { translate } from './translations';

export const industryKeys: Record<Industry, string> = {
  'Healthcare': 'healthcare',
  'Financial Services': 'financial_services',
  'Technology & IT': 'technology',
  'Manufacturing & Industrial': 'technology', // Using 'technology' as fallback
  'Energy & Utilities': 'technology', // Using 'technology' as fallback
  'Food & Beverage': 'technology', // Using 'technology' as fallback
  'Education': 'technology', // Using 'technology' as fallback
  'Government & Public Sector': 'technology', // Using 'technology' as fallback
  'Telecommunications': 'technology', // Using 'technology' as fallback
  'Environmental & Sustainability': 'technology', // Using 'technology' as fallback
  'Life Sciences': 'healthcare', // Using 'healthcare' as fallback
  'SaaS & Tech': 'technology', // Using 'technology' as fallback
  'E-commerce & Payments': 'financial_services' // Using 'financial_services' as fallback
};

export const getIndustryTranslation = (industry: Industry, language: SupportedLanguage = 'en'): string => {
  const key = industryKeys[industry];
  return translate(key, language);
};
