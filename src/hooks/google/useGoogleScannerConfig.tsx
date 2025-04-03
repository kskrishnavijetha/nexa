
import { useState } from 'react';
import { Industry, Region } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';
import { toast } from 'sonner';

export function useGoogleScannerConfig() {
  const [industry, setIndustry] = useState<Industry | undefined>(undefined);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleIndustryChange = (newIndustry: Industry) => {
    console.log(`[GoogleServicesPage] Industry changed to: ${newIndustry}`);
    setIndustry(newIndustry);
  };

  const handleRegionChange = (newRegion: Region) => {
    console.log(`[GoogleServicesPage] Region changed to: ${newRegion}`);
    setRegion(newRegion);
  };

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    console.log(`[GoogleServicesPage] Language changed to: ${newLanguage}`);
    setLanguage(newLanguage);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    toast.success(`File selected: ${file.name}`);
  };

  return {
    industry,
    region,
    language,
    selectedFile,
    handleIndustryChange,
    handleRegionChange,
    handleLanguageChange,
    handleFileSelect
  };
}
