
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  connectGoogleService, 
  disconnectGoogleService, 
  scanGoogleService,
} from '@/utils/googleServices';
import { toast } from 'sonner';
import { GoogleService, GoogleServicesScannerProps, ScanResults, ScanViolation } from './types';
import ServiceTabs from './ServiceTabs';
import ScanButton from './ScanButton';
import ScanResultsComponent from './ScanResults';
import GoogleScannerStatus from './GoogleScannerStatus';
import '../assets/custom.css';

const GoogleServicesScanner: React.FC<GoogleServicesScannerProps> = ({ 
  industry, 
  region, 
  language,
  file
}) => {
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [isConnectingDocs, setIsConnectingDocs] = useState(false);
  const [isConnectingSharePoint, setIsConnectingSharePoint] = useState(false);
  const [isConnectingOutlook, setIsConnectingOutlook] = useState(false);
  const [isConnectingTeams, setIsConnectingTeams] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'google' | 'microsoft'>('google');
  
  const [connectedServices, setConnectedServices] = useState<GoogleService[]>([]);
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [lastScanTime, setLastScanTime] = useState<Date | undefined>(undefined);
  const [itemsScanned, setItemsScanned] = useState<number>(0);
  const [violationsFound, setViolationsFound] = useState<number>(0);
  
  const anyServiceConnected = connectedServices.length > 0;
  
  // Real-time simulation for connected services
  useEffect(() => {
    let interval: number | null = null;
    
    if (connectedServices.length > 0) {
      // Simulate real-time updates for connected services
      interval = window.setInterval(() => {
        // Simulate random changes to items scanned
        if (lastScanTime) {
          const randomChange = Math.floor(Math.random() * 5);
          setItemsScanned(prev => prev + randomChange);
          
          // Occasionally add a new violation
          if (Math.random() > 0.8) {
            setViolationsFound(prev => prev + 1);
            toast.info(`New potential compliance issue detected in ${connectedServices[Math.floor(Math.random() * connectedServices.length)]}`);
          }
        }
      }, 15000); // Update every 15 seconds
    }
    
    return () => {
      if (interval !== null) {
        window.clearInterval(interval);
      }
    };
  }, [connectedServices, lastScanTime]);
  
  const handleConnectDrive = async () => {
    setIsConnectingDrive(true);
    try {
      const result = await connectGoogleService('drive-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev, 'drive']);
        toast.success('Google Drive connected successfully');
      }
    } catch (error) {
      console.error('Error connecting Drive:', error);
      toast.error('Failed to connect Google Drive');
    } finally {
      setIsConnectingDrive(false);
    }
  };
  
  const handleConnectGmail = async () => {
    setIsConnectingGmail(true);
    try {
      const result = await connectGoogleService('gmail-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev, 'gmail']);
        toast.success('Gmail connected successfully');
      }
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      toast.error('Failed to connect Gmail');
    } finally {
      setIsConnectingGmail(false);
    }
  };
  
  const handleConnectDocs = async () => {
    setIsConnectingDocs(true);
    try {
      const result = await connectGoogleService('docs-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev, 'docs']);
        toast.success('Google Docs connected successfully');
      }
    } catch (error) {
      console.error('Error connecting Docs:', error);
      toast.error('Failed to connect Google Docs');
    } finally {
      setIsConnectingDocs(false);
    }
  };
  
  const handleConnectSharePoint = async () => {
    setIsConnectingSharePoint(true);
    try {
      const result = await connectGoogleService('sharepoint-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev, 'sharepoint']);
        toast.success('SharePoint connected successfully');
      }
    } catch (error) {
      console.error('Error connecting SharePoint:', error);
      toast.error('Failed to connect SharePoint');
    } finally {
      setIsConnectingSharePoint(false);
    }
  };
  
  const handleConnectOutlook = async () => {
    setIsConnectingOutlook(true);
    try {
      const result = await connectGoogleService('outlook-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev, 'outlook']);
        toast.success('Outlook connected successfully');
      }
    } catch (error) {
      console.error('Error connecting Outlook:', error);
      toast.error('Failed to connect Outlook');
    } finally {
      setIsConnectingOutlook(false);
    }
  };
  
  const handleConnectTeams = async () => {
    setIsConnectingTeams(true);
    try {
      const result = await connectGoogleService('teams-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev, 'teams']);
        toast.success('Teams connected successfully');
      }
    } catch (error) {
      console.error('Error connecting Teams:', error);
      toast.error('Failed to connect Teams');
    } finally {
      setIsConnectingTeams(false);
    }
  };
  
  const handleDisconnect = async (service: GoogleService) => {
    try {
      const serviceId = 
        service === 'drive' ? 'drive-1' : 
        service === 'gmail' ? 'gmail-1' : 
        service === 'docs' ? 'docs-1' :
        service === 'sharepoint' ? 'sharepoint-1' :
        service === 'outlook' ? 'outlook-1' : 'teams-1';
        
      await disconnectGoogleService(serviceId);
      setConnectedServices(prev => prev.filter(s => s !== service));
      toast.success(`${service} disconnected successfully`);
    } catch (error) {
      console.error(`Error disconnecting ${service}:`, error);
      toast.error(`Failed to disconnect ${service}`);
    }
  };
  
  const handleScan = async () => {
    if (!industry) {
      toast.error('Please select an industry before scanning');
      return;
    }
    
    if (connectedServices.length === 0) {
      toast.error('Please connect at least one service before scanning');
      return;
    }
    
    setIsScanning(true);
    setScanResults(null);
    
    try {
      // Scan each connected service
      const results = await Promise.all(
        connectedServices.map(service => {
          const serviceId = 
            service === 'drive' ? 'drive-1' : 
            service === 'gmail' ? 'gmail-1' : 
            service === 'docs' ? 'docs-1' :
            service === 'sharepoint' ? 'sharepoint-1' :
            service === 'outlook' ? 'outlook-1' : 'teams-1';
            
          return scanGoogleService(serviceId, industry, language, region);
        })
      );
      
      // Combine results and properly format them as ScanViolation objects
      const violations: ScanViolation[] = [];
      let totalItemsScanned = 0;
      
      results.forEach(result => {
        if (result.data) {
          totalItemsScanned += result.data.itemsScanned;
          
          if (result.data.reports) {
            result.data.reports.forEach(report => {
              // Each risk item in the report becomes a violation
              report.risks.forEach(risk => {
                violations.push({
                  title: risk.description,
                  description: `${risk.regulation}: ${risk.section || 'General compliance issue'}`,
                  severity: risk.severity,
                  service: result.data?.serviceType || 'unknown',
                  location: report.documentName
                });
              });
            });
          }
        }
      });
      
      setLastScanTime(new Date());
      setItemsScanned(totalItemsScanned);
      setViolationsFound(violations.length);
      setScanResults({ violations });
      toast.success('Scan completed successfully');
    } catch (error) {
      console.error('Error scanning:', error);
      toast.error('Failed to complete scan');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <GoogleScannerStatus 
        connectedServices={connectedServices}
        lastScanTime={lastScanTime}
        itemsScanned={itemsScanned}
        violationsFound={violationsFound}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Cloud Services Integration</CardTitle>
          <CardDescription>
            Connect your cloud services to scan for compliance issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'google' | 'microsoft')}>
            <TabsList className="mb-4">
              <TabsTrigger value="google">Google Services</TabsTrigger>
              <TabsTrigger value="microsoft">Microsoft Services</TabsTrigger>
            </TabsList>
            
            <ServiceTabs 
              activeTab={activeTab}
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
            />
          </Tabs>
          
          <ScanButton 
            onScan={handleScan} 
            isScanning={isScanning} 
            disabled={!anyServiceConnected || !industry}
          />
        </CardContent>
      </Card>
      
      {scanResults && <ScanResultsComponent violations={scanResults.violations} />}
    </div>
  );
};

export default GoogleServicesScanner;
