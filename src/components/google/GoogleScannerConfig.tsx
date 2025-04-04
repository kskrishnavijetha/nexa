
import React from 'react';
import { Industry, Region } from '@/utils/types';
import { SupportedLanguage, supportedLanguages } from '@/utils/language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IndustrySelector from '../document-uploader/IndustrySelector';
import RegionSelector from '../document-uploader/RegionSelector';
import GoogleFileUploader from './GoogleFileUploader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface GoogleScannerConfigProps {
  industry: Industry | undefined;
  setIndustry: (industry: Industry) => void;
  region: Region | undefined;
  setRegion: (region: Region) => void;
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  onFileSelect: (file: File) => void;
}

const GoogleScannerConfig: React.FC<GoogleScannerConfigProps> = ({
  industry,
  setIndustry,
  region,
  setRegion,
  language,
  setLanguage,
  onFileSelect
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Configure Scanner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <IndustrySelector 
            industry={industry} 
            setIndustry={setIndustry} 
          />
          
          <RegionSelector 
            region={region} 
            setRegion={setRegion} 
          />
          
          <GoogleFileUploader onFileSelect={onFileSelect} />
          
          <div>
            <label htmlFor="language" className="block text-sm font-medium mb-1">
              Report Language
            </label>
            <Select value={language} onValueChange={val => setLanguage(val as SupportedLanguage)}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleScannerConfig;
