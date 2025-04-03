
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScanResults as ScanResultsType, GoogleService, Industry } from '../types';
import CloudServicesCard from '../CloudServicesCard';
import ScanResultsComponent from '../ScanResults';

interface TabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scanResults: ScanResultsType | null;
  lastScanTime: Date | undefined;
  itemsScanned: number;
  violationsFound: number;
  selectedIndustry: Industry | undefined;
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
  isCompactView?: boolean;
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
  children,
  isCompactView = false
}) => {
  const anyServiceConnected = connectedServices.length > 0;
  
  return (
    <div>
      <Tabs defaultValue="connect" className="w-full">
        <TabsList className={isCompactView ? "w-full mb-4" : ""}>
          <TabsTrigger value="connect" className={isCompactView ? "flex-1 text-xs" : ""}>
            Connect Services
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!scanResults} className={isCompactView ? "flex-1 text-xs" : ""}>
            Scan Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect">
          <CloudServicesCard
            isScanning={isScanning}
            connectedServices={connectedServices}
            isConnectingDrive={isConnectingDrive}
            isConnectingGmail={isConnectingGmail}
            isConnectingDocs={isConnectingDocs}
            onConnectDrive={onConnectDrive}
            onConnectGmail={onConnectGmail}
            onConnectDocs={onConnectDocs}
            onDisconnect={onDisconnect}
            onScan={() => setActiveTab('results')}
            anyServiceConnected={anyServiceConnected}
            disableScan={isScanning}
            isCompactView={isCompactView}
          />
          
          {children}
        </TabsContent>
        
        <TabsContent value="results">
          {scanResults && (
            <ScanResultsComponent
              violations={scanResults.violations}
              industry={selectedIndustry}
              isCompactView={isCompactView}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsContainer;
