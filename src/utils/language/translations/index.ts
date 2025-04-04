
import { SupportedLanguage } from '../types';
import { commonTranslations } from './common';
import { complianceTranslations } from './compliance';
import { historyTranslations } from './history';
import { industriesTranslations } from './industries';
import { reportsTranslations } from './reports';

// Combine all translations into a single object
const allTranslations: Record<string, Record<SupportedLanguage, string>> = {
  ...commonTranslations,
  ...complianceTranslations,
  ...historyTranslations,
  ...industriesTranslations,
  ...reportsTranslations,
};

export const translate = (key: string, language: SupportedLanguage = 'en'): string => {
  if (!allTranslations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  return allTranslations[key][language] || allTranslations[key].en;
};

// Re-export individual translation modules
export * from './common';
export * from './compliance';
export * from './history';
export * from './industries';
export * from './reports';
