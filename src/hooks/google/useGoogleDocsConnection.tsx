
import { useState } from 'react';
import { connectGoogleService, disconnectGoogleService } from '@/utils/google/connectionService';
import { toast } from 'sonner';
import { useGoogleAuth } from './useGoogleAuth';

/**
 * Hook to manage Google Docs connection
 */
export function useGoogleDocsConnection() {
  const [isConnectingDocs, setIsConnectingDocs] = useState(false);
  const { storeRequestedService } = useGoogleAuth();
  
  const handleConnectDocs = async (autoConnect = false) => {
    if (!autoConnect) {
      // Store requested service for when we come back from auth
      storeRequestedService('docs');
    }
    
    setIsConnectingDocs(true);
    try {
      // Mock authentication
      const result = await connectGoogleService('docs-1');
      if (result.data && result.data.connected) {
        return result.data.connected;
      }
    } catch (error) {
      console.error('Error connecting Docs:', error);
      toast.error('Failed to connect Google Docs');
      return false;
    } finally {
      setIsConnectingDocs(false);
    }

    return false;
  };

  return {
    isConnectingDocs,
    handleConnectDocs
  };
}
