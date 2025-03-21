
import { SupportedLanguage, supportedLanguages } from './types';

export const getLanguagePreference = (): SupportedLanguage => {
  // Get from localStorage if available
  const savedLanguage = localStorage.getItem('preferredLanguage') as SupportedLanguage | null;
  if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
    return savedLanguage;
  }
  
  // Try to detect from browser
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  if (supportedLanguages.some(lang => lang.code === browserLang)) {
    return browserLang;
  }
  
  // Default to English
  return 'en';
};
