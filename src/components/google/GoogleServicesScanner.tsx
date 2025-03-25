
import { useEffect } from 'react';
import { GoogleServicesScannerProps, ScanResults } from './types';
import { useGoogleServiceConnections } from '@/hooks/useGoogleServiceConnections';
import { useServiceScanner } from '@/hooks/useServiceScanner';
import GoogleScannerStatus from './GoogleScannerStatus';
import CloudServicesCard from './CloudServicesCard';
import ScanResultsComponent from './ScanResults';

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
    isConnectingSharePoint,
    isConnectingOutlook,
    isConnectingTeams,
    connectedServices,
    handleConnectDrive,
    handleConnectGmail,
    handleConnectDocs,
    handleConnectSharePoint,
    handleConnectOutlook,
    handleConnectTeams,
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
    handleScan(connectedServices, industry, language, region);
  };

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
        isConnectingSharePoint={isConnectingSharePoint}
        isConnectingOutlook={isConnectingOutlook}
        isConnectingTeams={isConnectingTeams}
        onConnectDrive={handleConnectDrive}
        onConnectGmail={handleConnectGmail}
        onConnectDocs={handleConnectDocs}
        onConnectSharePoint={handleConnectSharePoint}
        onConnectOutlook={handleConnectOutlook}
        onConnectTeams={handleConnectTeams}
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
