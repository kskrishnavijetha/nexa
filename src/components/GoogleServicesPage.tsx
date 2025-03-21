
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Industry, Region } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';
import { CloudLightning, History, Settings } from 'lucide-react';
import AuditTrail from './audit/AuditTrail';
import GoogleServicesScanner from './google/GoogleServicesScanner';
import GoogleScannerConfig from './google/GoogleScannerConfig';
import GoogleScannerStatus from './google/GoogleScannerStatus';
import GoogleScannerSettings from './google/GoogleScannerSettings';

const GoogleServicesPage: React.FC = () => {
  const [industry, setIndustry] = useState<Industry | undefined>(undefined);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState('scanner');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleIndustryChange = (newIndustry: Industry) => {
    setIndustry(newIndustry);
  };

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Google Services Compliance</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GoogleScannerConfig
          industry={industry}
          setIndustry={handleIndustryChange}
          region={region}
          setRegion={handleRegionChange}
          language={language}
          setLanguage={handleLanguageChange}
          onFileSelect={handleFileSelect}
        />

        <GoogleScannerStatus />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <CloudLightning className="h-4 w-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scanner" className="mt-6">
          <GoogleServicesScanner 
            industry={industry}
            language={language}
            region={region}
            file={selectedFile}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <AuditTrail documentName="Google Services Scanner" />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <GoogleScannerSettings industry={industry} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoogleServicesPage;
