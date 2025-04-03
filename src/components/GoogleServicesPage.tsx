
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CloudLightning, History, Settings } from 'lucide-react';
import AuditTrail from './audit/AuditTrail';
import GoogleServicesScanner from './google/GoogleServicesScanner';
import GoogleScannerConfig from './google/GoogleScannerConfig';
import GoogleScannerSettings from './google/GoogleScannerSettings';
import ServiceHistory from './google/ServiceHistory';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { GoogleService } from './google/types';
import { useGoogleScannerConfig } from '@/hooks/google/useGoogleScannerConfig';
import { useTabManagement } from '@/hooks/google/useTabManagement';
import ViewModeToggle from './google/ViewModeToggle';
import { useIsMobile } from '@/hooks/use-mobile';

const GoogleServicesPage: React.FC = () => {
  const { 
    industry, 
    region, 
    language, 
    selectedFile,
    handleIndustryChange, 
    handleRegionChange, 
    handleLanguageChange, 
    handleFileSelect 
  } = useGoogleScannerConfig();
  
  const { activeTab, handleTabChange } = useTabManagement();
  const [persistedConnectedServices, setPersistedConnectedServices] = useState<GoogleService[]>([]);
  const [isCompactView, setIsCompactView] = useState(false);
  const isMobile = useIsMobile();
  
  // Set compact view by default on mobile
  useEffect(() => {
    setIsCompactView(isMobile);
  }, [isMobile]);

  const handleServicesUpdate = (services: GoogleService[]) => {
    setPersistedConnectedServices(services);
  };

  const toggleViewMode = () => {
    setIsCompactView(prev => !prev);
  };

  // Ensure consistent document name for both scanner and audit trail
  const documentTitle = "Cloud Services Scanner";

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Cloud Services Compliance</h1>

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
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <div className="flex justify-between items-center mb-2">
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
          
          {activeTab === "scanner" && (
            <ViewModeToggle isCompactView={isCompactView} onToggle={toggleViewMode} />
          )}
        </div>
        
        <TabsContent value="scanner" className="mt-6">
          <GoogleServicesScanner 
            industry={industry}
            language={language}
            region={region}
            file={selectedFile}
            persistedConnectedServices={persistedConnectedServices}
            onServicesUpdate={handleServicesUpdate}
            isCompactView={isCompactView}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <ServiceHistory />
            <AuditTrail documentName={documentTitle} industry={industry} />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <GoogleScannerSettings industry={industry} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoogleServicesPage;
