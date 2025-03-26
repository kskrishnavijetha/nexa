
import { useState } from 'react';
import { connectGoogleService, disconnectGoogleService } from '@/utils/google/connectionService';
import { toast } from 'sonner';
import { useGoogleAuth } from './useGoogleAuth';

/**
 * Hook to manage Gmail connection
 */
export function useGmailConnection() {
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const { storeRequestedService } = useGoogleAuth();
  
  const handleConnectGmail = async (autoConnect = false) => {
    if (!autoConnect) {
      // Store requested service for when we come back from auth
      storeRequestedService('gmail');
    }
    
    setIsConnectingGmail(true);
    try {
      // Mock authentication
      const result = await connectGoogleService('gmail-1');
      if (result.data && result.data.connected) {
        return result.data.connected;
      }
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      toast.error('Failed to connect Gmail');
      return false;
    } finally {
      setIsConnectingGmail(false);
    }

    return false;
  };

  return {
    isConnectingGmail,
    handleConnectGmail
  };
}
