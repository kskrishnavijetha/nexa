
import { useState } from 'react';
import { connectGoogleService, disconnectGoogleService } from '@/utils/google/connectionService';
import { toast } from 'sonner';

/**
 * Hook to manage Microsoft services connections
 */
export function useMicrosoftConnections() {
  const [isConnectingSharePoint, setIsConnectingSharePoint] = useState(false);
  const [isConnectingOutlook, setIsConnectingOutlook] = useState(false);
  const [isConnectingTeams, setIsConnectingTeams] = useState(false);
  
  const handleConnectSharePoint = async () => {
    setIsConnectingSharePoint(true);
    try {
      const result = await connectGoogleService('sharepoint-1');
      if (result.data && result.data.connected) {
        return result.data.connected;
      }
    } catch (error) {
      console.error('Error connecting SharePoint:', error);
      toast.error('Failed to connect SharePoint');
      return false;
    } finally {
      setIsConnectingSharePoint(false);
    }
    return false;
  };
  
  const handleConnectOutlook = async () => {
    setIsConnectingOutlook(true);
    try {
      const result = await connectGoogleService('outlook-1');
      if (result.data && result.data.connected) {
        return result.data.connected;
      }
    } catch (error) {
      console.error('Error connecting Outlook:', error);
      toast.error('Failed to connect Outlook');
      return false;
    } finally {
      setIsConnectingOutlook(false);
    }
    return false;
  };
  
  const handleConnectTeams = async () => {
    setIsConnectingTeams(true);
    try {
      const result = await connectGoogleService('teams-1');
      if (result.data && result.data.connected) {
        return result.data.connected;
      }
    } catch (error) {
      console.error('Error connecting Teams:', error);
      toast.error('Failed to connect Teams');
      return false;
    } finally {
      setIsConnectingTeams(false);
    }
    return false;
  };

  return {
    isConnectingSharePoint,
    isConnectingOutlook,
    isConnectingTeams,
    handleConnectSharePoint,
    handleConnectOutlook,
    handleConnectTeams
  };
}
