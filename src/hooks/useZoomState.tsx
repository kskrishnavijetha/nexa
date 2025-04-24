
import { useState, useEffect, useCallback } from 'react';
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

export function useZoomState() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connection, setConnection] = useState<ZoomConnection | null>(null);
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [scanResult, setScanResult] = useState<ZoomScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    
    try {
      console.log('Loading Zoom connection...');
      const response = await getZoomConnection();
      
      if (response.success && response.data) {
        console.log('Zoom connection loaded successfully:', response.data);
        setConnection(response.data);
        
        if (response.data.connected) {
          // If connected, load meetings
          console.log('Loading Zoom meetings...');
          const meetingsResponse = await getZoomMeetings();
          
          if (meetingsResponse.success && meetingsResponse.data) {
            console.log('Zoom meetings loaded successfully:', meetingsResponse.data.length, 'meetings');
            setMeetings(meetingsResponse.data);
          } else if (meetingsResponse.error) {
            console.error('Error loading Zoom meetings:', meetingsResponse.error);
            setError(meetingsResponse.error);
            toast.error(`Failed to load Zoom meetings: ${meetingsResponse.error}`);
          }
        }
      } else if (response.error) {
        console.error('Error loading Zoom connection:', response.error);
        setError(response.error);
        toast.error(`Failed to load Zoom connection: ${response.error}`);
      }
    } catch (error) {
      console.error('Exception loading Zoom connection:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Failed to load Zoom connection: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateNewMeeting = useCallback(() => {
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

    setMeetings(prev => [newMeeting, ...prev]);
    toast.info(`New Zoom meeting detected: ${newMeeting.topic}`);
  }, []);

  const handleConnectZoom = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      console.log('Connecting to Zoom...');
      const response = await connectZoom();
      
      if (response.success && response.data) {
        console.log('Successfully connected to Zoom:', response.data);
        setConnection(response.data);
        toast.success('Successfully connected to Zoom');
        
        console.log('Loading Zoom meetings after connection...');
        const meetingsResponse = await getZoomMeetings();
        
        if (meetingsResponse.success && meetingsResponse.data) {
          console.log('Zoom meetings loaded successfully:', meetingsResponse.data.length, 'meetings');
          setMeetings(meetingsResponse.data);
        } else if (meetingsResponse.error) {
          console.error('Error loading Zoom meetings after connection:', meetingsResponse.error);
          // Still connected, but couldn't load meetings
          toast.error(`Connected to Zoom, but failed to load meetings: ${meetingsResponse.error}`);
        }
      } else {
        console.error('Failed to connect to Zoom:', response.error);
        setError(response.error || 'Unknown connection error');
        toast.error(response.error || 'Failed to connect to Zoom');
      }
    } catch (error) {
      console.error('Exception connecting to Zoom:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`An error occurred while connecting to Zoom: ${errorMessage}`);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnectZoom = async () => {
    setIsDisconnecting(true);
    setError(null);
    
    try {
      console.log('Disconnecting from Zoom...');
      const response = await disconnectZoom();
      
      if (response.success) {
        console.log('Successfully disconnected from Zoom');
        setConnection(response.data || null);
        setMeetings([]);
        setScanResult(null);
        toast.success('Successfully disconnected from Zoom');
      } else {
        console.error('Failed to disconnect from Zoom:', response.error);
        setError(response.error || 'Unknown disconnection error');
        toast.error(response.error || 'Failed to disconnect from Zoom');
      }
    } catch (error) {
      console.error('Exception disconnecting from Zoom:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`An error occurred while disconnecting from Zoom: ${errorMessage}`);
    } finally {
      setIsDisconnecting(false);
    }
  };
  
  const handleScanZoomMeetings = async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      console.log('Scanning Zoom meetings...');
      const response = await scanZoomMeetings();
      
      if (response.success && response.data) {
        console.log('Scan completed successfully:', response.data);
        setScanResult(response.data);
        toast.success('Scan completed successfully');
        
        if (response.data.violationsFound > 0) {
          toast.error(`${response.data.violationsFound} compliance violations found!`);
        }
      } else {
        console.error('Failed to scan Zoom meetings:', response.error);
        setError(response.error || 'Unknown scanning error');
        toast.error(response.error || 'Failed to scan Zoom meetings');
      }
    } catch (error) {
      console.error('Exception scanning Zoom meetings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`An error occurred while scanning Zoom meetings: ${errorMessage}`);
    } finally {
      setIsScanning(false);
    }
  };

  const retryConnection = () => {
    toast.info('Retrying Zoom connection...');
    setError(null);
    loadZoomConnection();
  };

  return {
    isLoading,
    isConnecting,
    isDisconnecting,
    isScanning,
    connection,
    meetings,
    scanResult,
    error,
    handleConnectZoom,
    handleDisconnectZoom,
    handleScanZoomMeetings,
    retryConnection
  };
}
