
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GoogleServiceConnection, GoogleServiceScanResult, connectGoogleService, disconnectGoogleService, getGoogleConnections, scanGoogleService } from '@/utils/googleServices';
import { Check, ExternalLink, Lock, Mail, FileText, Database, Loader2, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Industry, Region } from '@/utils/types';
import { Progress } from '@/components/ui/progress';
import { SupportedLanguage } from '@/utils/language';

interface GoogleServicesScannerProps {
  industry?: Industry;
  language?: SupportedLanguage;
  region?: Region;
}

const GoogleServicesScanner: React.FC<GoogleServicesScannerProps> = ({ 
  industry, 
  language,
  region
}) => {
  const [connections, setConnections] = useState<GoogleServiceConnection[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [scanning, setScanning] = useState<{ [key: string]: boolean }>({});
  const [scanResults, setScanResults] = useState<{ [key: string]: GoogleServiceScanResult | null }>({});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    const response = await getGoogleConnections();
    if (response.data) {
      setConnections(response.data);
    } else {
      toast.error(response.error || 'Failed to load Google connections');
    }
  };

  const handleConnect = async (serviceId: string) => {
    setLoading(prev => ({ ...prev, [serviceId]: true }));
    
    try {
      const response = await connectGoogleService(serviceId);
      
      if (response.data) {
        setConnections(prev => 
          prev.map(conn => conn.id === serviceId ? response.data : conn)
        );
        toast.success(`Connected to ${response.data.name} successfully`);
      } else {
        toast.error(response.error || 'Failed to connect to service');
      }
    } catch (error) {
      toast.error('An error occurred while connecting to the service');
    } finally {
      setLoading(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  const handleDisconnect = async (serviceId: string) => {
    setLoading(prev => ({ ...prev, [serviceId]: true }));
    
    try {
      const response = await disconnectGoogleService(serviceId);
      
      if (response.data) {
        setConnections(prev => 
          prev.map(conn => conn.id === serviceId ? response.data : conn)
        );
        toast.success(`Disconnected from ${response.data.name} successfully`);
        
        // Clear scan results for this service
        setScanResults(prev => ({
          ...prev,
          [serviceId]: null
        }));
      } else {
        toast.error(response.error || 'Failed to disconnect from service');
      }
    } catch (error) {
      toast.error('An error occurred while disconnecting from the service');
    } finally {
      setLoading(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  const handleScan = async (serviceId: string) => {
    setScanning(prev => ({ ...prev, [serviceId]: true }));
    setScanResults(prev => ({ ...prev, [serviceId]: null }));
    
    try {
      const response = await scanGoogleService(serviceId, industry, language, region);
      
      if (response.data) {
        setScanResults(prev => ({
          ...prev,
          [serviceId]: response.data
        }));
        
        toast.success(`Scanned ${response.data.serviceType} successfully`, {
          description: `Found ${response.data.violationsFound} compliance issues out of ${response.data.itemsScanned} items`
        });
        
        // Update tab to show results
        setActiveTab(serviceId);
      } else {
        toast.error(response.error || 'Failed to scan service');
      }
    } catch (error) {
      toast.error('An error occurred while scanning the service');
    } finally {
      setScanning(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'gmail':
        return <Mail className="h-5 w-5 text-red-500" />;
      case 'drive':
        return <Database className="h-5 w-5 text-blue-500" />;
      case 'docs':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <Lock className="h-5 w-5 text-gray-500" />;
    }
  };

  const renderConnectionCard = (connection: GoogleServiceConnection) => {
    const isLoading = loading[connection.id] || false;
    const isScanning = scanning[connection.id] || false;
    const isConnected = connection.connected;
    
    return (
      <Card key={connection.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getServiceIcon(connection.type)}
              <CardTitle className="text-base">{connection.name}</CardTitle>
            </div>
            <Badge variant={isConnected ? "success" : "outline"}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isConnected && (
            <div className="mb-4 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Last scanned:</span>
                <span>{connection.lastScanned ? new Date(connection.lastScanned).toLocaleString() : 'Never'}</span>
              </p>
              <p className="flex items-center justify-between mt-1">
                <span className="text-muted-foreground">Items:</span>
                <span>{connection.itemCount || '0'}</span>
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {isConnected ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDisconnect(connection.id)}
                  disabled={isLoading || isScanning}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Disconnect'}
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="flex-1"
                  onClick={() => handleScan(connection.id)}
                  disabled={isLoading || isScanning}
                >
                  {isScanning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {isScanning ? 'Scanning...' : 'Scan Now'}
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                className="w-full"
                onClick={() => handleConnect(connection.id)}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isLoading ? 'Connecting...' : 'Connect'}
              </Button>
            )}
          </div>
          
          {isScanning && (
            <div className="mt-4">
              <p className="text-sm mb-2">Scanning in progress...</p>
              <Progress value={Math.random() * 100} max={100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderScanResults = (serviceId: string) => {
    const result = scanResults[serviceId];
    
    if (!result) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No scan results available for this service yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Connect and scan the service to see compliance results.
          </p>
        </div>
      );
    }
    
    return (
      <div>
        <div className="mb-6 bg-muted/50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Scan Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-background p-3 rounded-md">
              <p className="text-muted-foreground">Items Scanned</p>
              <p className="text-2xl font-semibold">{result.itemsScanned}</p>
            </div>
            <div className="bg-background p-3 rounded-md">
              <p className="text-muted-foreground">Violations Found</p>
              <p className="text-2xl font-semibold text-red-500">{result.violationsFound}</p>
            </div>
            <div className="bg-background p-3 rounded-md">
              <p className="text-muted-foreground">Scan Date</p>
              <p className="text-base font-medium">{new Date(result.scanDate).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {result.violationsFound > 0 ? (
          <div>
            <h3 className="font-medium mb-3">Compliance Issues</h3>
            <div className="space-y-4">
              {result.reports.map((report, index) => (
                <Card key={index} className="border-red-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm">{report.documentName}</CardTitle>
                      <Badge variant="destructive" className="ml-2">
                        {report.overallScore}% Compliant
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{report.summary}</p>
                    
                    {report.risks.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium mb-2">Key Risks:</h4>
                        <ul className="text-xs space-y-1">
                          {report.risks.slice(0, 3).map((risk, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                              <span>{risk.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto mt-2 text-xs"
                    >
                      View Full Report
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Check className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-muted-foreground">No compliance issues found in this service.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Google Services Compliance Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {connections.map(conn => (
              <TabsTrigger key={conn.id} value={conn.id}>
                {conn.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="overview">
            <p className="text-sm text-muted-foreground mb-4">
              Connect to your Google services to scan them for compliance violations in real-time.
            </p>
            <div className="space-y-4">
              {connections.map(renderConnectionCard)}
            </div>
          </TabsContent>
          
          {connections.map(conn => (
            <TabsContent key={conn.id} value={conn.id}>
              {renderScanResults(conn.id)}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GoogleServicesScanner;
