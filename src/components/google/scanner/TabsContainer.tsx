
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScanResults } from '@/components/google/types';
import { ScanResults as ScanResultsComponent } from '../index';
import ServiceCard from '../service-card/ServiceCard';
import { GoogleService } from '../types';
import { Industry } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';

interface TabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scanResults: ScanResults | null;
  lastScanTime: Date | null;
  itemsScanned: number;
  violationsFound: number;
  selectedIndustry?: Industry;
  isScanning: boolean;
  connectedServices: GoogleService[];
  isConnectingDrive: boolean;
  isConnectingGmail: boolean;
  isConnectingDocs: boolean;
  onConnectDrive: () => void;
  onConnectGmail: () => void;
  onConnectDocs: () => void;
  onDisconnect: (service: GoogleService) => void;
  isCompactView: boolean;
  children: React.ReactNode;
  language?: SupportedLanguage;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  activeTab,
  setActiveTab,
  scanResults,
  lastScanTime,
  itemsScanned,
  violationsFound,
  selectedIndustry,
  isScanning,
  connectedServices,
  isConnectingDrive,
  isConnectingGmail,
  isConnectingDocs,
  onConnectDrive,
  onConnectGmail,
  onConnectDocs,
  onDisconnect,
  isCompactView,
  children,
  language = 'en'
}) => {
  if (isCompactView) {
    // Simplified view with tab content next to scanner controls
    return (
      <div className="space-y-6">
        {children}
        
        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 gap-4">
            <ServiceCard 
              serviceId="drive"
              isConnected={connectedServices.includes('drive')}
              isConnecting={isConnectingDrive}
              isScanning={isScanning && connectedServices.includes('drive')}
              onConnect={onConnectDrive}
              onDisconnect={() => onDisconnect('drive')}
              isCompactView={true}
            />
            <ServiceCard 
              serviceId="gmail"
              isConnected={connectedServices.includes('gmail')}
              isConnecting={isConnectingGmail}
              isScanning={isScanning && connectedServices.includes('gmail')}
              onConnect={onConnectGmail}
              onDisconnect={() => onDisconnect('gmail')}
              isCompactView={true}
            />
            <ServiceCard 
              serviceId="docs"
              isConnected={connectedServices.includes('docs')}
              isConnecting={isConnectingDocs}
              isScanning={isScanning && connectedServices.includes('docs')}
              onConnect={onConnectDocs}
              onDisconnect={() => onDisconnect('docs')}
              isCompactView={true}
            />
          </div>
        )}
        
        {activeTab === 'results' && scanResults && (
          <ScanResultsComponent 
            violations={scanResults.violations} 
            industry={selectedIndustry}
            isCompactView={true}
            language={language}
          />
        )}
      </div>
    );
  }
  
  // Full view with tabs
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="scanner">Scanner</TabsTrigger>
        <TabsTrigger value="results" disabled={!scanResults}>
          Results{violationsFound > 0 ? ` (${violationsFound})` : ''}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="scanner" className="space-y-6">
        {children}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ServiceCard 
            serviceId="drive"
            isConnected={connectedServices.includes('drive')}
            isConnecting={isConnectingDrive}
            isScanning={isScanning && connectedServices.includes('drive')}
            onConnect={onConnectDrive}
            onDisconnect={() => onDisconnect('drive')}
          />
          <ServiceCard 
            serviceId="gmail"
            isConnected={connectedServices.includes('gmail')}
            isConnecting={isConnectingGmail}
            isScanning={isScanning && connectedServices.includes('gmail')}
            onConnect={onConnectGmail}
            onDisconnect={() => onDisconnect('gmail')}
          />
          <ServiceCard 
            serviceId="docs"
            isConnected={connectedServices.includes('docs')}
            isConnecting={isConnectingDocs}
            isScanning={isScanning && connectedServices.includes('docs')}
            onConnect={onConnectDocs}
            onDisconnect={() => onDisconnect('docs')}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="results">
        {scanResults && (
          <ScanResultsComponent 
            violations={scanResults.violations} 
            industry={selectedIndustry}
            language={language}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TabsContainer;
