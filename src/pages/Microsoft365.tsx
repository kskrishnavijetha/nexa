
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CloudIcon, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getMicrosoftConnections, 
  connectMicrosoftService, 
  disconnectMicrosoftService,
  scanMicrosoftService,
  MicrosoftServiceConnection,
  MicrosoftServiceScanResult
} from '@/utils/microsoft/microsoftServices';

const Microsoft365: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('services');
  const [services, setServices] = useState<MicrosoftServiceConnection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({});
  const [scanResults, setScanResults] = useState<MicrosoftServiceScanResult | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await getMicrosoftConnections();
      if (response.success && response.data) {
        setServices(response.data);
      } else {
        toast.error('Failed to load Microsoft 365 services');
      }
    } catch (error) {
      console.error('Error loading Microsoft services:', error);
      toast.error('Failed to load Microsoft 365 services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (serviceId: string) => {
    setIsConnecting(prev => ({ ...prev, [serviceId]: true }));
    try {
      const response = await connectMicrosoftService(serviceId);
      if (response.success && response.data) {
        setServices(prev => 
          prev.map(service => 
            service.id === serviceId ? response.data : service
          )
        );
        toast.success(`Connected to ${response.data.name} successfully`);
      } else {
        toast.error(`Failed to connect to service: ${response.error}`);
      }
    } catch (error) {
      console.error('Error connecting to service:', error);
      toast.error('Failed to connect to service');
    } finally {
      setIsConnecting(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  const handleDisconnect = async (serviceId: string) => {
    setIsConnecting(prev => ({ ...prev, [serviceId]: true }));
    try {
      const response = await disconnectMicrosoftService(serviceId);
      if (response.success && response.data) {
        setServices(prev => 
          prev.map(service => 
            service.id === serviceId ? response.data : service
          )
        );
        toast.success(`Disconnected from ${response.data.name} successfully`);
      } else {
        toast.error(`Failed to disconnect from service: ${response.error}`);
      }
    } catch (error) {
      console.error('Error disconnecting from service:', error);
      toast.error('Failed to disconnect from service');
    } finally {
      setIsConnecting(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  const handleScan = async (serviceId: string) => {
    setIsScanning(true);
    try {
      toast.loading('Scanning Microsoft service...', { id: 'scan-toast' });
      const response = await scanMicrosoftService(serviceId);
      if (response.success && response.data) {
        setScanResults(response.data);
        toast.success('Scan completed successfully', { id: 'scan-toast' });
        setActiveTab('results');
      } else {
        toast.error(`Scan failed: ${response.error || 'Unknown error'}`, { id: 'scan-toast' });
      }
    } catch (error) {
      console.error('Error scanning service:', error);
      toast.error('Failed to scan service', { id: 'scan-toast' });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Microsoft 365 Integration</h1>
            <p className="text-muted-foreground mt-2">
              Scan Microsoft 365 services for compliance violations
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchServices} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 gap-2">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="results" disabled={!scanResults}>Scan Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <span className="mr-2">
                          <CloudIcon className="h-5 w-5" />
                        </span>
                        {service.name}
                      </CardTitle>
                      {service.connected && (
                        <div className="rounded-full h-2 w-2 bg-green-500"></div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <CardDescription>
                      {service.connected 
                        ? `Connected ${service.lastScanned ? `on ${new Date(service.lastScanned).toLocaleDateString()}` : ''}`
                        : 'Not connected'}
                    </CardDescription>
                    
                    {service.connected && service.itemCount && (
                      <p className="text-sm">
                        {service.itemCount} items available for scanning
                      </p>
                    )}
                    
                    <div className="flex flex-col gap-2">
                      {service.connected ? (
                        <>
                          <Button 
                            onClick={() => handleScan(service.id)} 
                            disabled={isScanning}
                            className="w-full"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Scan Now
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDisconnect(service.id)}
                            disabled={isConnecting[service.id]}
                            className="w-full"
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleConnect(service.id)}
                          disabled={isConnecting[service.id]}
                          className="w-full"
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {scanResults && (
              <Card>
                <CardHeader>
                  <CardTitle>Scan Results: {scanResults.serviceType}</CardTitle>
                  <CardDescription>
                    Scanned {scanResults.itemsScanned} items on {new Date(scanResults.scanDate).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {scanResults.violationsFound === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-lg font-medium text-green-600">No compliance violations found!</p>
                      <p className="text-muted-foreground mt-2">All scanned content meets compliance requirements</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b">
                        <p className="font-semibold">Found {scanResults.violationsFound} compliance {scanResults.violationsFound === 1 ? 'issue' : 'issues'}</p>
                      </div>
                      
                      <div className="space-y-3">
                        {scanResults.reports.map((report, idx) => (
                          <div key={idx} className="p-3 border rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{report.documentName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Risk level: <span className={`font-medium ${
                                    report.riskLevel === 'high' ? 'text-red-500' : 
                                    report.riskLevel === 'medium' ? 'text-amber-500' : 'text-green-500'
                                  }`}>{report.riskLevel.toUpperCase()}</span>
                                </p>
                              </div>
                            </div>
                            
                            <div className="mt-2 space-y-2">
                              {report.issues.map((issue, issueIdx) => (
                                <div key={issueIdx} className="text-sm bg-muted/50 p-2 rounded">
                                  <p>{issue.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Microsoft365;
