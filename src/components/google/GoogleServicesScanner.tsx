
import { useEffect } from 'react';
import { GoogleServicesScannerProps, ScanResults } from './types';
import { useGoogleServiceConnections } from '@/hooks/useGoogleServiceConnections';
import { useServiceScanner } from '@/hooks/useServiceScanner';
import GoogleScannerStatus from './GoogleScannerStatus';
import CloudServicesCard from './CloudServicesCard';
import ScanResultsComponent from './ScanResults';
import { toast } from 'sonner';

const GoogleServicesScanner: React.FC<GoogleServicesScannerProps> = ({ 
  industry, 
  region, 
  language,
  file
}) => {
  // Use custom hooks for state and handlers
  const {
    isConnectingDrive,
    isConnectingGmail,
    isConnectingDocs,
    connectedServices,
    handleConnectDrive,
    handleConnectGmail,
    handleConnectDocs,
    handleDisconnect
  } = useGoogleServiceConnections();

  const {
    isScanning,
    scanResults,
    lastScanTime,
    itemsScanned,
    violationsFound,
    handleScan
  } = useServiceScanner();
  
  const anyServiceConnected = connectedServices.length > 0;
  
  // Handler for scan button
  const onScanButtonClick = () => {
    console.log('Scan button clicked', {
      connectedServices,
      industry,
      language,
      region
    });
    
    if (connectedServices.length === 0) {
      toast.error('No services connected. Please connect at least one service before scanning.');
      return;
    }
    
    if (!industry) {
      toast.error('No industry selected. Please select an industry before scanning.');
      return;
    }
    
    handleScan(connectedServices, industry, language, region);
  };

  // Show guidance if no services are connected
  useEffect(() => {
    if (connectedServices.length === 0) {
      toast.info('Connect at least one service and select an industry to begin scanning', {
        duration: 5000,
        id: 'connect-service-toast', // Prevent duplicate toasts
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <GoogleScannerStatus 
        connectedServices={connectedServices}
        lastScanTime={lastScanTime}
        itemsScanned={itemsScanned}
        violationsFound={violationsFound}
      />
      
      <CloudServicesCard
        isScanning={isScanning}
        connectedServices={connectedServices}
        isConnectingDrive={isConnectingDrive}
        isConnectingGmail={isConnectingGmail}
        isConnectingDocs={isConnectingDocs}
        onConnectDrive={handleConnectDrive}
        onConnectGmail={handleConnectGmail}
        onConnectDocs={handleConnectDocs}
        onDisconnect={handleDisconnect}
        onScan={onScanButtonClick}
        anyServiceConnected={anyServiceConnected}
        disableScan={!industry}
      />
      
      {scanResults && <ScanResultsComponent violations={scanResults.violations} />}
    </div>
  );
};

export default GoogleServicesScanner;
