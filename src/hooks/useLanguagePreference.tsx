
import { useState, useEffect } from 'react';
import { SupportedLanguage, getLanguagePreference } from '@/utils/language';

export const useLanguagePreference = () => {
  const [language, setLanguage] = useState<SupportedLanguage>(getLanguagePreference());

  useEffect(() => {
    // Update the document language attribute
    document.documentElement.lang = language;
  }, [language]);

  return { language, setLanguage };
};

export default useLanguagePreference;
