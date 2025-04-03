import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ShieldCheck } from 'lucide-react';
import ServiceTabs from './ServiceTabs';
import ConnectionStatus from './ConnectionStatus';
import ScanResults from './ScanResults';
import ScanStats from './ScanStats';
import { GoogleServicesScannerProps } from './types';
import { GoogleService } from './types';
import { useServiceScanner } from '@/hooks/useServiceScanner';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { toast } from 'sonner';

const GoogleServicesScanner: React.FC<GoogleServicesScannerProps> = ({
  industry,
  region,
  language,
  file,
  persistedConnectedServices = [],
  onServicesUpdate
}) => {
  const [activeTab, setActiveTab] = useState('scanner');
  const [connectedServices, setConnectedServices] = useState<GoogleService[]>(persistedConnectedServices);
  
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [isConnectingDocs, setIsConnectingDocs] = useState(false);
  
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
  }, [persistedConnectedServices]);

  useEffect(() => {
    if (onServicesUpdate) {
      onServicesUpdate(connectedServices);
    }
  }, [connectedServices, onServicesUpdate]);

  const handleConnectDrive = () => {
    const isDriveConnected = connectedServices.includes('drive');
    
    if (isDriveConnected) {
      setConnectedServices(prev => prev.filter(s => s !== 'drive'));
      toast.success('Google Drive disconnected');
    } else {
      setIsConnectingDrive(true);
      
      setTimeout(() => {
        setConnectedServices(prev => [...prev, 'drive']);
        setIsConnectingDrive(false);
        toast.success('Google Drive connected successfully');
      }, 1500);
    }
  };

  const handleConnectGmail = () => {
    const isGmailConnected = connectedServices.includes('gmail');
    
    if (isGmailConnected) {
      setConnectedServices(prev => prev.filter(s => s !== 'gmail'));
      toast.success('Gmail disconnected');
    } else {
      setIsConnectingGmail(true);
      
      setTimeout(() => {
        setConnectedServices(prev => [...prev, 'gmail']);
        setIsConnectingGmail(false);
        toast.success('Gmail connected successfully');
      }, 1500);
    }
  };

  const handleConnectDocs = () => {
    const isDocsConnected = connectedServices.includes('docs');
    
    if (isDocsConnected) {
      setConnectedServices(prev => prev.filter(s => s !== 'docs'));
      toast.success('Google Docs disconnected');
    } else {
      setIsConnectingDocs(true);
      
      setTimeout(() => {
        setConnectedServices(prev => [...prev, 'docs']);
        setIsConnectingDocs(false);
        toast.success('Google Docs connected successfully');
      }, 1500);
    }
  };

  const handleDisconnect = (service: GoogleService) => {
    setConnectedServices(prev => prev.filter(s => s !== service));
    toast.success(`${service} disconnected`);
  };

  const handleStartScan = async () => {
    if (!industry) {
      toast.error('Please select an industry before scanning');
      return;
    }
    
    if (connectedServices.length === 0) {
      toast.error('Please connect at least one service before scanning');
      return;
    }
    
    try {
      await handleScan(connectedServices, industry, language, region);
      
      if (scanResults) {
        addScanHistory({
          serviceId: connectedServices.join('-'),
          serviceName: connectedServices.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', '),
          scanDate: new Date().toISOString(),
          itemsScanned: itemsScanned,
          violationsFound: violationsFound,
          documentName: 'Cloud Services Scan',
          fileName: file ? file.name : 'multiple services'
        });
      }
    } catch (error) {
      console.error('Error starting scan:', error);
      toast.error('Failed to complete scan');
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
          <Tabs defaultValue="scanner" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="scanner">Connect Services</TabsTrigger>
              <TabsTrigger value="results" disabled={!scanResults}>Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scanner">
              <div className="space-y-6">
                <ServiceTabs 
                  activeTab="google"
                  isScanning={isScanning}
                  connectedServices={connectedServices}
                  isConnectingDrive={isConnectingDrive}
                  isConnectingGmail={isConnectingGmail}
                  isConnectingDocs={isConnectingDocs}
                  onConnectDrive={handleConnectDrive}
                  onConnectGmail={handleConnectGmail}
                  onConnectDocs={handleConnectDocs}
                  onDisconnect={handleDisconnect}
                />
                
                <ConnectionStatus 
                  connectedServices={connectedServices} 
                  isScanning={isScanning}
                />
                
                <Button 
                  disabled={isScanning || connectedServices.length === 0 || !industry}
                  className="w-full"
                  onClick={handleStartScan}
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    'Start Compliance Scan'
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              {scanResults && (
                <div className="space-y-6">
                  <ScanStats 
                    lastScanTime={lastScanTime}
                    itemsScanned={itemsScanned}
                    violationsFound={violationsFound}
                  />
                  
                  <ScanResults 
                    violations={scanResults.violations} 
                    industry={scanResults.industry || selectedIndustry} 
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleServicesScanner;
