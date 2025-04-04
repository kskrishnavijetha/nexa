
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
import ConnectionStatus from './ConnectionStatus';
import { SupportedLanguage } from '@/utils/language/types';

const GoogleServicesScanner: React.FC<GoogleServicesScannerProps> = ({
  industry,
  region,
  language,
  file,
  persistedConnectedServices = [],
  onServicesUpdate,
  isCompactView = false
}) => {
  const [activeTab, setActiveTab] = useState('scanner');
  const [uploadedFileName, setUploadedFileName] = useState<string | undefined>(file?.name);
  
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

  useEffect(() => {
    if (file?.name) {
      setUploadedFileName(file.name);
    }
  }, [file]);

  useEffect(() => {
    const handleFileUploaded = (e: any) => {
      if (e.detail && e.detail.fileName) {
        setUploadedFileName(e.detail.fileName);
        console.log('File uploaded event detected:', e.detail.fileName);
      }
    };
    
    window.addEventListener('file-uploaded', handleFileUploaded);
    return () => {
      window.removeEventListener('file-uploaded', handleFileUploaded);
    };
  }, []);

  const handleStartScan = async (
    services: GoogleService[], 
    selectedIndustry: typeof industry, 
    selectedLanguage: SupportedLanguage = 'en',
    selectedRegion = region
  ) => {
    await handleScan(services, selectedIndustry, selectedLanguage, selectedRegion);
    
    if (scanResults) {
      const documentName = uploadedFileName || 'Cloud Services Scan';
      
      addScanHistory({
        serviceId: services.join('-'),
        serviceName: services.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', '),
        scanDate: new Date().toISOString(),
        itemsScanned: itemsScanned,
        violationsFound: violationsFound,
        documentName: documentName,
        fileName: uploadedFileName || (file ? file.name : 'multiple services')
      });
      
      console.log('Scan completed and added to history:', documentName);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className={isCompactView ? "pb-2 pt-4 px-4" : ""}>
          <CardTitle className="flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2" />
            Cloud Services Scanner
          </CardTitle>
          {!isCompactView && (
            <CardDescription>
              Connect and scan your Google services for compliance risks
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className={isCompactView ? "px-4 py-2" : ""}>
          {isCompactView && connectedServices.length > 0 && (
            <div className="mb-4">
              <ConnectionStatus 
                connectedServices={connectedServices} 
                isScanning={isScanning} 
              />
            </div>
          )}
          
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
            isCompactView={isCompactView}
          >
            <ScannerControls
              connectedServices={connectedServices}
              isScanning={isScanning}
              industry={industry}
              language="en"
              region={region}
              file={file}
              onScan={handleStartScan}
              isCompactView={isCompactView}
              onScanComplete={(itemsScanned, violationsFound) => {
                console.log(`Scan completed: ${itemsScanned} items scanned, ${violationsFound} violations found`);
                
                if (scanResults && scanResults.violations.length > 0) {
                  setActiveTab('results');
                }
              }}
            />
          </TabsContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleServicesScanner;
