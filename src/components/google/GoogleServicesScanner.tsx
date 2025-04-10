
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { GoogleServicesScannerProps } from './types';
import { GoogleService } from './types';
import { useServiceScanner } from '@/hooks/useServiceScanner';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { useGoogleServiceConnections } from '@/hooks/useGoogleServiceConnections';
import TabsContainer from './scanner/TabsContainer';
import ScannerControls from './scanner/ScannerControls';
import ConnectionStatus from './ConnectionStatus';
import { SupportedLanguage } from '@/utils/language';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGoogleAuth } from '@/hooks/google/useGoogleAuth';
import { Button } from '@/components/ui/button';

const GoogleServicesScanner: React.FC<GoogleServicesScannerProps> = ({
  industry,
  region,
  language,
  file,
  persistedConnectedServices = [],
  onServicesUpdate,
  isCompactView = false
}) => {
  const [activeTab, setActiveTab] = useState('connect');
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
  const { gApiInitialized, apiLoading, apiError, retryInitialization } = useGoogleAuth();
  
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
    selectedLanguage?: SupportedLanguage,
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

  const handleRetryApiInit = () => {
    retryInitialization();
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
          {apiLoading && (
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-500" />
                <AlertDescription className="text-blue-700">
                  Initializing Google services. Please wait...
                </AlertDescription>
              </div>
            </Alert>
          )}
          
          {apiError && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  <AlertDescription className="text-red-700">
                    {apiError}
                  </AlertDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 mt-2"
                  onClick={handleRetryApiInit}
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </Alert>
          )}
          
          {!gApiInitialized && !apiLoading && !apiError && (
            <Alert className="mb-4 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
              <AlertDescription className="text-amber-700">
                Failed to initialize Google services. Please refresh the page and try again.
              </AlertDescription>
            </Alert>
          )}
          
          {isCompactView && connectedServices.length > 0 && (
            <div className="mb-4">
              <ConnectionStatus 
                connectedServices={connectedServices} 
                isScanning={isScanning} 
              />
            </div>
          )}
          
          {(!apiError && (gApiInitialized || !apiLoading)) && (
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
    </div>
  );
};

export default GoogleServicesScanner;
