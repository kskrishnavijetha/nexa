
import { useState } from 'react';
import { connectGoogleService, disconnectGoogleService } from '@/utils/google/connectionService';
import { toast } from 'sonner';
import { useGoogleAuth } from './useGoogleAuth';

/**
 * Hook to manage Google Drive connection
 */
export function useGoogleDriveConnection() {
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);
  const { storeRequestedService } = useGoogleAuth();

  const handleConnectDrive = async (autoConnect = false) => {
    if (!autoConnect) {
      // Store requested service for when we come back from auth
      storeRequestedService('drive');
    }
    
    setIsConnectingDrive(true);
    try {
      // Mock Google OAuth flow - in a real app, this would redirect to Google
      // const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?...' 
      // window.location.href = authUrl;
      
      // For demo purposes, simulate successful connection
      const result = await connectGoogleService('drive-1');
      if (result.data && result.data.connected) {
        return result.data.connected;
      }
    } catch (error) {
      console.error('Error connecting Drive:', error);
      toast.error('Failed to connect Google Drive');
      return false;
    } finally {
      setIsConnectingDrive(false);
    }

    return false;
  };

  return {
    isConnectingDrive,
    handleConnectDrive
  };
}
