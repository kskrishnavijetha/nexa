
import React from 'react';
import { Industry, Region } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IndustrySelector from '../document-uploader/IndustrySelector';
import RegionSelector from '../document-uploader/RegionSelector';
import GoogleFileUploader from './GoogleFileUploader';

interface GoogleScannerConfigProps {
  industry: Industry | undefined;
  setIndustry: (industry: Industry) => void;
  region: Region | undefined;
  setRegion: (region: Region) => void;
  language: any; // Keep this prop to avoid breaking the parent component
  setLanguage: (language: any) => void; // Keep this prop to avoid breaking the parent component
  onFileSelect: (file: File) => void;
}

const GoogleScannerConfig: React.FC<GoogleScannerConfigProps> = ({
  industry,
  setIndustry,
  region,
  setRegion,
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
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleScannerConfig;
