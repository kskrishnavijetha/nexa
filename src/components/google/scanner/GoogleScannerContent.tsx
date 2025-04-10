
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { GoogleServicesScannerProps } from '../types';
import TabsContainer from './TabsContainer';
import ScannerControls from './ScannerControls';
import ConnectionStatus from '../ConnectionStatus';
import { useScannerState } from './hooks/useScannerState';
import { GoogleApiStatusInfo } from './GoogleApiStatusInfo';

interface GoogleScannerContentProps extends GoogleServicesScannerProps {
  uploadedFileName?: string;
  isApiLoading: boolean;
  apiError: string | null;
  gApiInitialized: boolean;
  retryInitialization: () => void;
}

const GoogleScannerContent: React.FC<GoogleScannerContentProps> = ({
  industry,
  region,
  language,
  file,
  persistedConnectedServices = [],
  onServicesUpdate,
  isCompactView = false,
  uploadedFileName,
  isApiLoading,
  apiError,
  gApiInitialized,
  retryInitialization
}) => {
  const {
    activeTab,
    setActiveTab,
    isScanning,
    scanResults,
    lastScanTime,
    itemsScanned,
    violationsFound,
    selectedIndustry,
    handleStartScan,
    connectedServices,
    isConnectingDrive,
    isConnectingGmail,
    isConnectingDocs,
    handleConnectDrive,
    handleConnectGmail,
    handleConnectDocs,
    handleDisconnect
  } = useScannerState({
    industry,
    region,
    language,
    file,
    uploadedFileName,
    persistedConnectedServices,
    onServicesUpdate
  });

  return (
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
        <GoogleApiStatusInfo 
          isApiLoading={isApiLoading}
          apiError={apiError}
          gApiInitialized={gApiInitialized}
          retryInitialization={retryInitialization}
        />
        
        {isCompactView && connectedServices.length > 0 && (
          <div className="mb-4">
            <ConnectionStatus 
              connectedServices={connectedServices} 
              isScanning={isScanning} 
            />
          </div>
        )}
        
        {(!apiError && (gApiInitialized || !isApiLoading)) && (
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
              language={language}
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
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleScannerContent;
