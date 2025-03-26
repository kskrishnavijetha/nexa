
import { useEffect } from 'react';
import { GoogleServicesScannerProps, ScanResults } from './types';
import { useGoogleServiceConnections } from '@/hooks/useGoogleServiceConnections';
import { useServiceScanner } from '@/hooks/useServiceScanner';
import GoogleScannerStatus from './GoogleScannerStatus';
import CloudServicesCard from './CloudServicesCard';
import ScanResultsComponent from './ScanResults';
import MicrosoftScanResults from '../microsoft/MicrosoftScanResults';
import { toast } from 'sonner';
import { useRealTimeScan } from '@/contexts/RealTimeScanContext';

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
  
  const { updateScanStats } = useRealTimeScan();
  
  const anyServiceConnected = connectedServices.length > 0;
  
  // When connection state changes, update the global scan stats
  useEffect(() => {
    updateScanStats({
      isActive: anyServiceConnected
    });
  }, [anyServiceConnected, updateScanStats]);
  
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
  
  // Filter scan results by service type
  const getServiceViolations = (serviceType: 'google' | 'microsoft') => {
    if (!scanResults) return [];
    
    return scanResults.violations.filter(violation => {
      const service = violation.service.toLowerCase();
      
      if (serviceType === 'google') {
        return service === 'gmail' || service === 'drive' || service === 'docs';
      } else {
        return service === 'sharepoint' || service === 'outlook' || service === 'teams';
      }
    });
  };
  
  const googleViolations = getServiceViolations('google');
  const microsoftViolations = getServiceViolations('microsoft');

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
      
      {/* Render Google and Microsoft scan results separately */}
      {googleViolations.length > 0 && (
        <ScanResultsComponent violations={googleViolations} />
      )}
      
      {microsoftViolations.length > 0 && (
        <MicrosoftScanResults 
          violations={microsoftViolations} 
          serviceName="Microsoft Services" 
        />
      )}
    </div>
  );
};

export default GoogleServicesScanner;
