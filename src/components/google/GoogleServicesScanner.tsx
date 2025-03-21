
import { useState } from 'react';
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
  
  const anyServiceConnected = connectedServices.length > 0;
  
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
      
      results.forEach(result => {
        if (result.data?.reports) {
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
      });
      
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
