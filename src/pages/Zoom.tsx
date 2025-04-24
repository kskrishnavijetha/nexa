
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { connectZoom, disconnectZoom, getZoomConnection, isZoomConnected, scanZoomMeetings, ZoomScanResult } from "@/utils/zoom/zoomServices";
import { SupportedLanguage } from '@/utils/language';
import { Industry, Region } from '@/utils/types';
import { toast } from "sonner";
import { Loader2, FileTextIcon, VideoIcon, FileAudioIcon, AlertCircleIcon, CheckCircleIcon, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const Zoom = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connected, setConnected] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | undefined>();
  const [scanResults, setScanResults] = useState<ZoomScanResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [industry] = useState<Industry>('Finance & Banking'); // Default industry
  
  useEffect(() => {
    checkConnection();
  }, []);
  
  const checkConnection = async () => {
    try {
      const isConnected = isZoomConnected();
      setConnected(isConnected);
      
      if (isConnected) {
        const response = await getZoomConnection();
        if (response.success && response.data) {
          setLastScanned(response.data.lastScanned);
        }
      }
    } catch (error) {
      console.error("Failed to check Zoom connection:", error);
    }
  };
  
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await connectZoom();
      if (response.success) {
        setConnected(true);
        setLastScanned(response.data?.lastScanned);
        toast.success("Connected to Zoom successfully!");
      } else {
        toast.error("Failed to connect to Zoom");
      }
    } catch (error) {
      console.error("Error connecting to Zoom:", error);
      toast.error("An error occurred while connecting to Zoom");
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const response = await disconnectZoom();
      if (response.success) {
        setConnected(false);
        setLastScanned(undefined);
        setScanResults(null);
        toast.success("Disconnected from Zoom");
      } else {
        toast.error("Failed to disconnect from Zoom");
      }
    } catch (error) {
      console.error("Error disconnecting from Zoom:", error);
      toast.error("An error occurred while disconnecting from Zoom");
    } finally {
      setIsDisconnecting(false);
    }
  };
  
  const handleScan = async () => {
    if (!connected) {
      toast.error("Please connect to Zoom first");
      return;
    }
    
    setIsScanning(true);
    setActiveTab('results');
    
    try {
      const response = await scanZoomMeetings(industry);
      if (response.success && response.data) {
        setScanResults(response.data);
        setLastScanned(response.data.scanDate);
        toast.success(`Scan completed: ${response.data.violationsFound} compliance issues found`);
      } else {
        toast.error("Failed to scan Zoom meetings");
      }
    } catch (error) {
      console.error("Error scanning Zoom meetings:", error);
      toast.error("An error occurred while scanning Zoom meetings");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Zoom Integration</h1>
            <p className="text-muted-foreground mt-1">
              Scan Zoom meetings, recordings, and transcripts for compliance issues
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {connected ? (
              <>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Connected</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                >
                  {isDisconnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    "Disconnect"
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect to Zoom"
                )}
              </Button>
            )}
          </div>
        </div>

        {connected ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="results">Scan Results</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Zoom Compliance Scanner</CardTitle>
                  <CardDescription>
                    Scan your Zoom meetings, recordings and transcripts for potential compliance issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div>
                        <h3 className="font-medium">Last scanned</h3>
                        <p className="text-sm text-muted-foreground">
                          {lastScanned ? format(new Date(lastScanned), "PPpp") : "Never scanned"}
                        </p>
                      </div>
                      
                      <Button onClick={handleScan} disabled={isScanning}>
                        {isScanning ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          "Scan Now"
                        )}
                      </Button>
                    </div>
                    
                    {scanResults && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Meetings Scanned</h4>
                            <VideoIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold mt-2">{scanResults.meetingsScanned}</p>
                        </div>
                        
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Recordings Analyzed</h4>
                            <FileAudioIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold mt-2">{scanResults.recordingsScanned}</p>
                        </div>
                        
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Transcripts Scanned</h4>
                            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold mt-2">{scanResults.transcriptsScanned}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {scanResults && (
                <Card className={scanResults.violationsFound > 0 ? "border-destructive/50" : "border-green-500/50"}>
                  <CardHeader className={scanResults.violationsFound > 0 ? "bg-destructive/10" : "bg-green-500/10"}>
                    <div className="flex items-center space-x-2">
                      {scanResults.violationsFound > 0 ? (
                        <AlertCircleIcon className="h-5 w-5 text-destructive" />
                      ) : (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      )}
                      <CardTitle>{scanResults.violationsFound > 0 ? "Issues Found" : "No Issues Found"}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {scanResults.violationsFound > 0 ? (
                      <div className="space-y-4">
                        <p>
                          We found {scanResults.violationsFound} potential compliance {scanResults.violationsFound === 1 ? 'issue' : 'issues'} in your Zoom content.
                        </p>
                        <Button variant="outline" onClick={() => setActiveTab('results')}>
                          View Details
                        </Button>
                      </div>
                    ) : (
                      <p>
                        Great job! No compliance issues were found in your Zoom content during this scan.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="results" className="space-y-4 mt-6">
              {isScanning ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <h3 className="text-xl font-medium">Scanning Zoom content</h3>
                    <p className="text-muted-foreground mt-2 text-center max-w-md">
                      We're analyzing your Zoom meetings, recordings and transcripts for potential compliance issues. This may take a few moments...
                    </p>
                  </CardContent>
                </Card>
              ) : !scanResults ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileTextIcon className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium">No scan results yet</h3>
                    <p className="text-muted-foreground mt-2 text-center max-w-md">
                      Run a scan to analyze your Zoom content for potential compliance issues.
                    </p>
                    <Button onClick={handleScan} className="mt-4">
                      Scan Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Scan Results</CardTitle>
                      <CardDescription>
                        Scan completed on {format(new Date(scanResults.scanDate), "PPpp")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="text-sm font-medium text-muted-foreground">Meetings Scanned</div>
                          <div className="text-2xl font-bold mt-1">{scanResults.meetingsScanned}</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="text-sm font-medium text-muted-foreground">Recordings Analyzed</div>
                          <div className="text-2xl font-bold mt-1">{scanResults.recordingsScanned}</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="text-sm font-medium text-muted-foreground">Transcripts Scanned</div>
                          <div className="text-2xl font-bold mt-1">{scanResults.transcriptsScanned}</div>
                        </div>
                        <div className={`p-4 rounded-lg ${scanResults.violationsFound > 0 ? "bg-destructive/10" : "bg-green-500/10"}`}>
                          <div className={`text-sm font-medium ${scanResults.violationsFound > 0 ? "text-destructive" : "text-green-600"}`}>
                            Compliance Issues
                          </div>
                          <div className={`text-2xl font-bold mt-1 ${scanResults.violationsFound > 0 ? "text-destructive" : "text-green-600"}`}>
                            {scanResults.violationsFound}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {scanResults.violationsFound > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Compliance Issues</h3>
                      {scanResults.reports.map((report, index) => (
                        <Card key={index} className="border-destructive/40">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{report.documentName}</CardTitle>
                                <CardDescription>
                                  {report.industry || industry} compliance
                                </CardDescription>
                              </div>
                              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                                {report.risks.length} {report.risks.length === 1 ? 'issue' : 'issues'}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {report.risks.map((risk, riskIndex) => (
                                <div key={riskIndex} className="border-l-2 border-destructive pl-3 py-1">
                                  <p className="font-medium">{risk.title || risk.description.split(':')[0] || 'Compliance Risk'}</p>
                                  <p className="text-sm text-muted-foreground">{risk.description}</p>
                                  <div className="mt-1 flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {risk.regulation || 'Regulation'}
                                    </Badge>
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${
                                        risk.severity === 'high' ? 'bg-destructive/10 text-destructive' :
                                        risk.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                                        'bg-blue-100 text-blue-800'
                                      }`}
                                    >
                                      {risk.severity} severity
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-green-500/40">
                      <CardHeader className="bg-green-500/10">
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          <CardTitle>No Compliance Issues Found</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p>
                          Great job! We didn't detect any compliance issues in your Zoom content during this scan.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Zoom Integration Settings</CardTitle>
                  <CardDescription>
                    Configure your Zoom integration settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <h3 className="font-medium">Zoom OAuth Status</h3>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <h3 className="font-medium">Automatic scanning</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure scheduled scans in the <a href="/settings" className="text-primary underline underline-offset-2">Settings</a> page
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex items-center" asChild>
                      <a href="https://marketplace.zoom.us/" target="_blank" rel="noopener noreferrer">
                        Zoom App Marketplace
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center py-12">
              <div className="rounded-full bg-muted p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground">
                  <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-6.921-5.092L10.5 12l6.579 5.092v-10.184z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium">Connect your Zoom account</h3>
              <p className="text-muted-foreground text-center max-w-md mt-2 mb-6">
                Connect your Zoom account to scan meetings, recordings, and transcripts for compliance issues
              </p>
              <Button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect to Zoom"
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Zoom;
