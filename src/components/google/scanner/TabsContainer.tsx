
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScanResults as ScanResultsType, GoogleService } from '../types';
import CloudServicesCard from '../CloudServicesCard';
import ScanResultsComponent from '../ScanResults';

interface TabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scanResults: ScanResultsType | null;
  lastScanTime: Date | undefined;
  itemsScanned: number;
  violationsFound: number;
  selectedIndustry: any | undefined;
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
  
  // Auto-switch to results tab when scan results become available
  useEffect(() => {
    if (scanResults && scanResults.violations.length > 0) {
      setActiveTab('results');
    }
  }, [scanResults, setActiveTab]);
  
  // Listen for file upload complete event
  useEffect(() => {
    const handleFileUploaded = () => {
      if (!isScanning) {
        console.log('File upload detected, auto-switching to results tab after scan');
      }
    };
    
    window.addEventListener('file-uploaded', handleFileUploaded);
    return () => {
      window.removeEventListener('file-uploaded', handleFileUploaded);
    };
  }, [isScanning, setActiveTab]);
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
