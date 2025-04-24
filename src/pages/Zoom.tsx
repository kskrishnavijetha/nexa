
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  connectZoom, 
  disconnectZoom, 
  getZoomConnection, 
  getZoomMeetings,
  scanZoomMeetings,
  ZoomConnection,
  ZoomMeeting,
  ZoomScanResult
} from '@/utils/zoom/zoomServices';
import { Loader2, Camera, Power, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

const Zoom = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connection, setConnection] = useState<ZoomConnection | null>(null);
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [scanResult, setScanResult] = useState<ZoomScanResult | null>(null);

  useEffect(() => {
    loadZoomConnection();

    // Set up real-time updates for demo purposes
    const interval = setInterval(() => {
      if (connection?.connected) {
        simulateNewMeeting();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [connection]);

  const loadZoomConnection = async () => {
    setIsLoading(true);
    try {
      const response = await getZoomConnection();
      if (response.success && response.data) {
        setConnection(response.data);
        
        if (response.data.connected) {
          // If connected, load meetings
          const meetingsResponse = await getZoomMeetings();
          if (meetingsResponse.success && meetingsResponse.data) {
            setMeetings(meetingsResponse.data);
          }
        }
      }
    } catch (error) {
      console.error('Error loading Zoom connection:', error);
      toast.error('Failed to load Zoom connection status');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo function to simulate real-time updates with new meetings
  const simulateNewMeeting = () => {
    const now = new Date();
    const newMeeting: ZoomMeeting = {
      id: `meeting-${Math.random().toString(36).substring(2, 9)}`,
      topic: `New ${['Weekly', 'Project', 'Team', 'Client'][Math.floor(Math.random() * 4)]} Meeting`,
      startTime: now.toISOString(),
      duration: Math.floor(Math.random() * 60) + 15,
      participantsCount: Math.floor(Math.random() * 10) + 1,
      hasRecording: Math.random() > 0.5,
      hasTranscript: Math.random() > 0.7
    };

    // Add the new meeting to the list and show a toast notification
    setMeetings(prev => [newMeeting, ...prev]);
    toast.info(`New Zoom meeting detected: ${newMeeting.topic}`);
  };

  const handleConnectZoom = async () => {
    setIsConnecting(true);
    try {
      const response = await connectZoom();
      if (response.success && response.data) {
        setConnection(response.data);
        toast.success('Successfully connected to Zoom');
        
        // Load meetings after connecting
        const meetingsResponse = await getZoomMeetings();
        if (meetingsResponse.success && meetingsResponse.data) {
          setMeetings(meetingsResponse.data);
        }
      } else {
        toast.error(response.error || 'Failed to connect to Zoom');
      }
    } catch (error) {
      console.error('Error connecting to Zoom:', error);
      toast.error('An error occurred while connecting to Zoom');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnectZoom = async () => {
    setIsDisconnecting(true);
    try {
      const response = await disconnectZoom();
      if (response.success) {
        setConnection(response.data || null);
        setMeetings([]);
        setScanResult(null);
        toast.success('Successfully disconnected from Zoom');
      } else {
        toast.error(response.error || 'Failed to disconnect from Zoom');
      }
    } catch (error) {
      console.error('Error disconnecting from Zoom:', error);
      toast.error('An error occurred while disconnecting from Zoom');
    } finally {
      setIsDisconnecting(false);
    }
  };
  
  const handleScanZoomMeetings = async () => {
    setIsScanning(true);
    try {
      const response = await scanZoomMeetings();
      if (response.success && response.data) {
        setScanResult(response.data);
        toast.success('Scan completed successfully');
        
        // If violations were found, show a more noticeable toast
        if (response.data.violationsFound > 0) {
          toast.error(`${response.data.violationsFound} compliance violations found!`);
        }
      } else {
        toast.error(response.error || 'Failed to scan Zoom meetings');
      }
    } catch (error) {
      console.error('Error scanning Zoom meetings:', error);
      toast.error('An error occurred while scanning Zoom meetings');
    } finally {
      setIsScanning(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Zoom Integration</h1>
          <p className="text-muted-foreground mt-2">
            Scan Zoom meetings and recordings for compliance issues
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Connection Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>
                {connection?.connected
                  ? `Connected since ${connection.lastScanned ? format(new Date(connection.lastScanned), 'PPP pp') : 'recently'}`
                  : 'Connect to your Zoom account to start monitoring'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Camera className={`h-6 w-6 mr-2 ${connection?.connected ? 'text-green-500' : 'text-gray-400'}`} />
                  <span>
                    {connection?.connected
                      ? `${connection.meetingsCount} meetings available`
                      : 'Not connected'
                    }
                  </span>
                </div>
                <div>
                  {connection?.connected ? (
                    <Button 
                      variant="outline" 
                      onClick={handleDisconnectZoom} 
                      disabled={isDisconnecting}
                    >
                      {isDisconnecting ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Disconnecting</>
                      ) : (
                        <><Power className="h-4 w-4 mr-2" /> Disconnect</>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleConnectZoom} 
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Connecting</>
                      ) : (
                        <><Power className="h-4 w-4 mr-2" /> Connect</>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Meetings List */}
          {connection?.connected && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Recent Meetings</CardTitle>
                      <CardDescription>
                        Showing {meetings.length} recent Zoom meetings
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={handleScanZoomMeetings} 
                      disabled={isScanning}
                      className="shrink-0"
                    >
                      {isScanning ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Scanning</>
                      ) : (
                        <><ShieldAlert className="h-4 w-4 mr-2" /> Scan for Issues</>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {meetings.length > 0 ? (
                    <div className="space-y-4">
                      {meetings.map(meeting => (
                        <div key={meeting.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{meeting.topic}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(meeting.startTime), 'PPP pp')} · {meeting.duration} minutes
                              </p>
                              <div className="mt-2">
                                <span className="text-xs bg-gray-100 rounded px-2 py-1 mr-2">
                                  {meeting.participantsCount} {meeting.participantsCount === 1 ? 'participant' : 'participants'}
                                </span>
                                {meeting.hasRecording && (
                                  <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1 mr-2">
                                    Recording available
                                  </span>
                                )}
                                {meeting.hasTranscript && (
                                  <span className="text-xs bg-green-100 text-green-800 rounded px-2 py-1">
                                    Transcript available
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No meetings found in your Zoom account.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Scan Results */}
              {scanResult && (
                <Card className={scanResult.violationsFound > 0 ? 'border-red-500' : 'border-green-500'}>
                  <CardHeader className={scanResult.violationsFound > 0 ? 'bg-red-50' : 'bg-green-50'}>
                    <CardTitle className="flex items-center">
                      <ShieldAlert className={`h-5 w-5 mr-2 ${scanResult.violationsFound > 0 ? 'text-red-500' : 'text-green-500'}`} />
                      Scan Results
                    </CardTitle>
                    <CardDescription>
                      Scan completed on {format(new Date(scanResult.scanDate), 'PPP pp')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <div className="text-sm text-muted-foreground">Meetings Scanned</div>
                        <div className="text-2xl font-bold">{scanResult.meetingsScanned}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <div className="text-sm text-muted-foreground">Recordings</div>
                        <div className="text-2xl font-bold">{scanResult.recordingsScanned}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <div className="text-sm text-muted-foreground">Transcripts</div>
                        <div className="text-2xl font-bold">{scanResult.transcriptsScanned}</div>
                      </div>
                      <div className={`${scanResult.violationsFound > 0 ? 'bg-red-50' : 'bg-green-50'} p-4 rounded`}>
                        <div className="text-sm text-muted-foreground">Violations</div>
                        <div className={`text-2xl font-bold ${scanResult.violationsFound > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {scanResult.violationsFound}
                        </div>
                      </div>
                    </div>
                    
                    {scanResult.violationsFound > 0 && (
                      <div className="mt-4 space-y-4">
                        <h3 className="font-medium">Compliance Issues Found</h3>
                        <div className="space-y-2">
                          {scanResult.reports.map((report, index) => (
                            <div key={index} className="border-l-4 border-red-500 bg-red-50 p-3">
                              <h4 className="font-medium">{report.summary?.substring(0, 120)}</h4>
                              <p className="text-sm text-gray-600">
                                {report.description?.substring(0, 120)}...
                              </p>
                              <div className="flex mt-2">
                                <Button size="sm" variant="outline">View Details</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {scanResult.violationsFound === 0 && (
                      <div className="text-center py-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-green-500 mb-2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <h3 className="text-lg font-medium text-green-700">No Compliance Issues Found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your Zoom meetings and recordings are compliant with your configured policies.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Zoom;
