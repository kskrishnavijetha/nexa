
import { useState } from 'react';
import { Industry, Region } from '@/utils/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Check, 
  ChevronRight, 
  Cloud, 
  FileText, 
  Loader2, 
  Mail, 
  XCircle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  connectGoogleService, 
  disconnectGoogleService, 
  scanGoogleService,
  GoogleServiceConnection
} from '@/utils/googleServices';
import { SupportedLanguage } from '@/utils/language';
import { toast } from 'sonner';

// Define type for Google service
type GoogleService = 'drive' | 'gmail' | 'docs';

interface GoogleServicesScannerProps {
  industry?: Industry;
  region?: Region;
  language: SupportedLanguage;
  file?: File | null;
}

const GoogleServicesScanner: React.FC<GoogleServicesScannerProps> = ({ 
  industry, 
  region, 
  language,
  file
}) => {
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [isConnectingDocs, setIsConnectingDocs] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const [connectedServices, setConnectedServices] = useState<GoogleService[]>([]);
  const [scanResults, setScanResults] = useState<any | null>(null);
  
  const isDriveConnected = connectedServices.includes('drive');
  const isGmailConnected = connectedServices.includes('gmail');
  const isDocsConnected = connectedServices.includes('docs');
  
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
  
  const handleDisconnect = async (service: GoogleService) => {
    try {
      await disconnectGoogleService(service === 'drive' ? 'drive-1' : service === 'gmail' ? 'gmail-1' : 'docs-1');
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
      toast.error('Please connect at least one Google service before scanning');
      return;
    }
    
    setIsScanning(true);
    setScanResults(null);
    
    try {
      // Scan each connected service
      const results = await Promise.all(
        connectedServices.map(service => {
          const serviceId = service === 'drive' ? 'drive-1' : service === 'gmail' ? 'gmail-1' : 'docs-1';
          return scanGoogleService(serviceId, industry, language, region);
        })
      );
      
      // Combine results
      const combinedResults = {
        violations: results.flatMap(result => 
          result.data?.reports.map(report => ({
            title: report.title,
            description: report.description,
            severity: report.severity,
            service: result.data?.serviceType || 'unknown',
            location: report.documentName
          })) || []
        )
      };
      
      setScanResults(combinedResults);
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
          <CardTitle>Google Services Integration</CardTitle>
          <CardDescription>
            Connect your Google services to scan for compliance issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center">
                    <Cloud className="h-4 w-4 mr-2 text-blue-500" />
                    Google Drive
                  </CardTitle>
                  <Badge variant={isDriveConnected ? "default" : "outline"} className={isDriveConnected ? "bg-green-500" : ""}>
                    {isDriveConnected ? 'Connected' : 'Not Connected'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Scan your Drive files for sensitive data and compliance issues
                </p>
                <Button 
                  variant={isDriveConnected ? "outline" : "default"} 
                  className="w-full"
                  onClick={isDriveConnected ? () => handleDisconnect('drive') : handleConnectDrive}
                  disabled={isConnectingDrive || isScanning}
                >
                  {isConnectingDrive ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : isDriveConnected ? (
                    'Disconnect'
                  ) : (
                    'Connect'
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-red-500" />
                    Gmail
                  </CardTitle>
                  <Badge variant={isGmailConnected ? "default" : "outline"} className={isGmailConnected ? "bg-green-500" : ""}>
                    {isGmailConnected ? 'Connected' : 'Not Connected'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyze email content for potential compliance violations
                </p>
                <Button 
                  variant={isGmailConnected ? "outline" : "default"} 
                  className="w-full"
                  onClick={isGmailConnected ? () => handleDisconnect('gmail') : handleConnectGmail}
                  disabled={isConnectingGmail || isScanning}
                >
                  {isConnectingGmail ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : isGmailConnected ? (
                    'Disconnect'
                  ) : (
                    'Connect'
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-green-500" />
                    Google Docs
                  </CardTitle>
                  <Badge variant={isDocsConnected ? "default" : "outline"} className={isDocsConnected ? "bg-green-500" : ""}>
                    {isDocsConnected ? 'Connected' : 'Not Connected'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Check documents for regulatory compliance and PII
                </p>
                <Button 
                  variant={isDocsConnected ? "outline" : "default"} 
                  className="w-full"
                  onClick={isDocsConnected ? () => handleDisconnect('docs') : handleConnectDocs}
                  disabled={isConnectingDocs || isScanning}
                >
                  {isConnectingDocs ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : isDocsConnected ? (
                    'Disconnect'
                  ) : (
                    'Connect'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mt-4">
            <Button 
              onClick={handleScan} 
              disabled={!anyServiceConnected || isScanning || !industry}
              className="px-8"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  Scan Now
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {scanResults && (
        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>
              Found {scanResults.violations.length} potential compliance issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scanResults.violations.map((violation: any, index: number) => (
                <div key={index} className="flex items-start p-3 rounded-md bg-muted/50">
                  {violation.severity === 'high' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  ) : violation.severity === 'medium' ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-medium">
                      {violation.title}
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${
                          violation.severity === 'high' 
                            ? 'border-red-200 bg-red-100 text-red-800' 
                            : violation.severity === 'medium'
                            ? 'border-amber-200 bg-amber-100 text-amber-800'
                            : 'border-blue-200 bg-blue-100 text-blue-800'
                        }`}
                      >
                        {violation.severity}
                      </Badge>
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">{violation.description}</p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="mr-2">
                        {violation.service}
                      </Badge>
                      <span>{violation.location}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {scanResults.violations.length === 0 && (
                <div className="flex items-center justify-center p-4 rounded-md bg-green-50 text-green-700">
                  <Check className="h-5 w-5 mr-2" />
                  <span>No compliance issues found</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoogleServicesScanner;
