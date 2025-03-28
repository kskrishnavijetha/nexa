
import { useEffect } from 'react';
import { GoogleService, GoogleServicesScannerProps, ScanResults } from './types';
import { useGoogleServiceConnections } from '@/hooks/useGoogleServiceConnections';
import { useServiceScanner } from '@/hooks/useServiceScanner';
import GoogleScannerStatus from './GoogleScannerStatus';
import CloudServicesCard from './CloudServicesCard';
import ScanResultsComponent from './ScanResults';
import { toast } from 'sonner';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { useAuth } from '@/contexts/AuthContext';

const GoogleServicesScanner: React.FC<GoogleServicesScannerProps> = ({ 
  industry, 
  region, 
  language,
  file,
  persistedConnectedServices = [],
  onServicesUpdate
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
    handleDisconnect,
    setConnectedServices
  } = useGoogleServiceConnections();

  const {
    isScanning,
    scanResults,
    lastScanTime,
    itemsScanned,
    violationsFound,
    handleScan
  } = useServiceScanner();

  const { addScanHistory, setUserId } = useServiceHistoryStore();
  const { user } = useAuth();
  
  // Update the user ID in the store when the user changes
  useEffect(() => {
    console.log('GoogleServicesScanner: Setting user ID in history store:', user?.id);
    if (user && user.id) {
      setUserId(user.id);
    }
  }, [user, setUserId]);
  
  // Initialize connected services from persisted state
  useEffect(() => {
    if (persistedConnectedServices.length > 0 && connectedServices.length === 0) {
      setConnectedServices(persistedConnectedServices);
    }
  }, [persistedConnectedServices, connectedServices.length, setConnectedServices]);

  // Update parent component when services change
  useEffect(() => {
    if (onServicesUpdate) {
      onServicesUpdate(connectedServices);
    }
  }, [connectedServices, onServicesUpdate]);
  
  const anyServiceConnected = connectedServices.length > 0;
  
  // Handler for scan button
  const onScanButtonClick = () => {
    console.log('Scan button clicked', {
      connectedServices,
      industry,
      language,
      region,
      userId: user?.id
    });
    
    if (connectedServices.length === 0) {
      toast.error('No services connected. Please connect at least one service before scanning.');
      return;
    }
    
    if (!industry) {
      toast.error('No industry selected. Please select an industry before scanning.');
      return;
    }
    
    // Pass the required parameters to handleScan
    handleScan(connectedServices, industry, language, region);

    // Only add to scan history if user is authenticated
    if (user && user.id) {
      console.log(`Adding scan history for user ${user.id}`);
      // Add to scan history for each connected service
      connectedServices.forEach(service => {
        const documentName = file?.name || `${service.charAt(0).toUpperCase() + service.slice(1)} Scan ${new Date().toLocaleTimeString()}`;
        addScanHistory({
          serviceId: service,
          serviceName: service === 'drive' ? 'Google Drive' : 
                      service === 'gmail' ? 'Gmail' : 'Google Docs',
          scanDate: new Date().toISOString(),
          itemsScanned: Math.floor(Math.random() * 50) + 10, // Placeholder for demo
          violationsFound: Math.floor(Math.random() * 5), // Placeholder for demo
          documentName: documentName
        });
      });
    } else {
      console.log('User not authenticated, skipping scan history addition');
      toast.warning('Sign in to save scan history', { duration: 3000 });
    }
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
