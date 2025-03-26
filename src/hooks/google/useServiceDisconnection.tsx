
import { GoogleService } from '@/components/google/types';
import { disconnectGoogleService } from '@/utils/google/connectionService';
import { toast } from 'sonner';

/**
 * Hook to handle disconnecting services
 */
export function useServiceDisconnection() {
  const handleDisconnect = async (service: GoogleService) => {
    try {
      const serviceId = 
        service === 'drive' ? 'drive-1' : 
        service === 'gmail' ? 'gmail-1' : 
        service === 'docs' ? 'docs-1' :
        service === 'sharepoint' ? 'sharepoint-1' :
        service === 'outlook' ? 'outlook-1' : 'teams-1';
        
      await disconnectGoogleService(serviceId);
      toast.success(`${service} disconnected successfully`);
      return true;
    } catch (error) {
      console.error(`Error disconnecting ${service}:`, error);
      toast.error(`Failed to disconnect ${service}`);
      return false;
    }
  };

  return { handleDisconnect };
}
