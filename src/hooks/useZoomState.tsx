
import { useState, useEffect } from 'react';
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

  return {
    isLoading,
    isConnecting,
    isDisconnecting,
    isScanning,
    connection,
    meetings,
    scanResult,
    handleConnectZoom,
    handleDisconnectZoom,
    handleScanZoomMeetings
  };
}
