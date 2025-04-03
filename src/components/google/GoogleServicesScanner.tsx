
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { GoogleServicesScannerProps } from './types';
import { GoogleService } from './types';
import { useServiceScanner } from '@/hooks/useServiceScanner';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { useGoogleServiceConnections } from '@/hooks/useGoogleServiceConnections';
import TabsContainer from './scanner/TabsContainer';
import ScannerControls from './scanner/ScannerControls';

const GoogleServicesScanner: React.FC<GoogleServicesScannerProps> = ({
  industry,
  region,
  language,
  file,
  persistedConnectedServices = [],
  onServicesUpdate
}) => {
  const [activeTab, setActiveTab] = useState('scanner');
  
  const {
    isConnectingDrive,
    isConnectingGmail,
    isConnectingDocs,
    connectedServices,
    setConnectedServices,
    handleConnectDrive,
    handleConnectGmail,
    handleConnectDocs,
    handleDisconnect
  } = useGoogleServiceConnections();
  
  const { addScanHistory } = useServiceHistoryStore();
  
  const {
    isScanning,
    scanResults,
    lastScanTime,
    itemsScanned,
    violationsFound,
    selectedIndustry,
    handleScan
  } = useServiceScanner();

  useEffect(() => {
    if (persistedConnectedServices.length > 0) {
      setConnectedServices(persistedConnectedServices);
    }
  }, [persistedConnectedServices, setConnectedServices]);

  useEffect(() => {
    if (onServicesUpdate) {
      onServicesUpdate(connectedServices);
    }
  }, [connectedServices, onServicesUpdate]);

  const handleStartScan = async (
    services: GoogleService[], 
    selectedIndustry: typeof industry, 
    selectedLanguage = language, 
    selectedRegion = region
  ) => {
    await handleScan(services, selectedIndustry, selectedLanguage, selectedRegion);
    
    if (scanResults) {
      addScanHistory({
        serviceId: services.join('-'),
        serviceName: services.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', '),
        scanDate: new Date().toISOString(),
        itemsScanned: itemsScanned,
        violationsFound: violationsFound,
        documentName: 'Cloud Services Scan',
        fileName: file ? file.name : 'multiple services'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2" />
            Cloud Services Scanner
          </CardTitle>
          <CardDescription>
            Connect and scan your Google services for compliance risks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsContainer
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            scanResults={scanResults}
            lastScanTime={lastScanTime}
            itemsScanned={itemsScanned}
            violationsFound={violationsFound}
            selectedIndustry={selectedIndustry}
            isScanning={isScanning}
            connectedServices={connectedServices}
            isConnectingDrive={isConnectingDrive}
            isConnectingGmail={isConnectingGmail}
            isConnectingDocs={isConnectingDocs}
            onConnectDrive={handleConnectDrive}
            onConnectGmail={handleConnectGmail}
            onConnectDocs={handleConnectDocs}
            onDisconnect={handleDisconnect}
          >
            <ScannerControls
              connectedServices={connectedServices}
              isScanning={isScanning}
              industry={industry}
              language={language}
              region={region}
              file={file}
              onScan={handleStartScan}
              onScanComplete={(itemsScanned, violationsFound) => {
                // This callback can be used for any post-scan operations
                console.log(`Scan completed: ${itemsScanned} items scanned, ${violationsFound} violations found`);
              }}
            />
          </TabsContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleServicesScanner;
