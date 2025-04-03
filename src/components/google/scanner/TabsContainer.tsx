
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScanResults } from '../types';
import ScanStats from '../ScanStats';
import ScanResults from '../ScanResults';
import { Industry } from '@/utils/types';
import ServiceTabs from '../ServiceTabs';
import ConnectionStatus from '../ConnectionStatus';
import { GoogleService } from '../types';

interface TabsContainerProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  scanResults: ScanResults | null;
  lastScanTime?: Date;
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
  children: React.ReactNode;
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
  children
}) => {
  return (
    <Tabs defaultValue="scanner" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="scanner">Connect Services</TabsTrigger>
        <TabsTrigger value="results" disabled={!scanResults}>Results</TabsTrigger>
      </TabsList>
      
      <TabsContent value="scanner">
        <div className="space-y-6">
          <ServiceTabs 
            activeTab="google"
            isScanning={isScanning}
            connectedServices={connectedServices}
            isConnectingDrive={isConnectingDrive}
            isConnectingGmail={isConnectingGmail}
            isConnectingDocs={isConnectingDocs}
            onConnectDrive={onConnectDrive}
            onConnectGmail={onConnectGmail}
            onConnectDocs={onConnectDocs}
            onDisconnect={onDisconnect}
          />
          
          <ConnectionStatus 
            connectedServices={connectedServices} 
            isScanning={isScanning}
          />
          
          {children}
        </div>
      </TabsContent>
      
      <TabsContent value="results">
        {scanResults && (
          <div className="space-y-6">
            <ScanStats 
              lastScanTime={lastScanTime}
              itemsScanned={itemsScanned}
              violationsFound={violationsFound}
            />
            
            <ScanResults 
              violations={scanResults.violations} 
              industry={scanResults.industry || selectedIndustry} 
            />
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TabsContainer;
