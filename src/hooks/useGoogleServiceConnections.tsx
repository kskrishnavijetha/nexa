
import { useState, useEffect } from 'react';
import { GoogleService } from '@/components/google/types';
import { connectGoogleService, disconnectGoogleService } from '@/utils/google/connectionService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleAuth } from '@/hooks/google/useGoogleAuth';

export function useGoogleServiceConnections() {
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [isConnectingDocs, setIsConnectingDocs] = useState(false);
  const [connectedServices, setConnectedServices] = useState<GoogleService[]>([]);
  const { user } = useAuth();
  const { signInToGoogle, signOutFromGoogle, isGoogleAuthenticated, gApiInitialized, apiError } = useGoogleAuth();
  
  // Clear connections if user signs out
  useEffect(() => {
    if (!user) {
      setConnectedServices([]);
    }
  }, [user]);

  const scanGoogleDrive = async () => {
    if (!window.gapi || !window.gapi.client || !window.gapi.client.drive) {
      console.error('Google Drive API not available');
      toast.error('Google Drive API not available. Please try again.');
      return [];
    }

    try {
      const response = await window.gapi.client.drive.files.list({
        'pageSize': 25,
        'fields': 'files(id, name, mimeType, createdTime, modifiedTime, size)'
      });
      
      console.log('Google Drive files:', response.result.files);
      return response.result.files;
    } catch (error) {
      console.error('Error scanning Google Drive:', error);
      toast.error('Failed to scan Google Drive');
      return [];
    }
  };

  const checkGoogleApiReady = () => {
    if (!user) {
      toast.error('Please sign in to connect services');
      return false;
    }
    
    if (!gApiInitialized) {
      toast.error('Google API not initialized yet. Please wait a moment and try again.');
      return false;
    }
    
    if (apiError) {
      toast.error('Google API encountered an error. Please try again after refreshing the page.');
      return false;
    }
    
    return true;
  };

  const handleConnectDrive = async () => {
    if (!checkGoogleApiReady()) return;
    
    setIsConnectingDrive(true);
    try {
      // Connect to Google using OAuth
      const success = await signInToGoogle();
      
      if (success) {
        // Initialize scan after successful authentication
        const files = await scanGoogleDrive();
        
        // Add drive to connected services
        setConnectedServices(prev => [...prev.filter(s => s !== 'drive'), 'drive']);
        toast.success(`Google Drive connected successfully. Found ${files.length} files.`);
        
        // Update mock connection service
        await connectGoogleService('drive-1');
      }
    } catch (error) {
      console.error('Error connecting Drive:', error);
      toast.error('Failed to connect Google Drive');
    } finally {
      setIsConnectingDrive(false);
    }
  };
  
  const handleConnectGmail = async () => {
    if (!checkGoogleApiReady()) return;
    
    setIsConnectingGmail(true);
    try {
      // For now, we'll just use the mock authentication
      // In a real implementation, you'd add Gmail-specific OAuth scope
      const success = await signInToGoogle();
      
      if (success) {
        const result = await connectGoogleService('gmail-1');
        if (result.data && result.data.connected) {
          setConnectedServices(prev => [...prev.filter(s => s !== 'gmail'), 'gmail']);
          toast.success('Gmail connected successfully');
        } else if (result.error) {
          toast.error(`Failed to connect: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      toast.error('Failed to connect Gmail');
    } finally {
      setIsConnectingGmail(false);
    }
  };
  
  const handleConnectDocs = async () => {
    if (!checkGoogleApiReady()) return;
    
    setIsConnectingDocs(true);
    try {
      // For now, we'll just use the mock authentication
      // In a real implementation, you'd add Google Docs-specific OAuth scope
      const success = await signInToGoogle();
      
      if (success) {
        const result = await connectGoogleService('docs-1');
        if (result.data && result.data.connected) {
          setConnectedServices(prev => [...prev.filter(s => s !== 'docs'), 'docs']);
          toast.success('Google Docs connected successfully');
        } else if (result.error) {
          toast.error(`Failed to connect: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error connecting Docs:', error);
      toast.error('Failed to connect Google Docs');
    } finally {
      setIsConnectingDocs(false);
    }
  };
  
  const handleDisconnect = async (service: GoogleService) => {
    if (!user) {
      toast.error('Please sign in to disconnect services');
      return;
    }
    
    try {
      // If disconnecting Drive, also sign out from Google
      if (service === 'drive' && isGoogleAuthenticated) {
        await signOutFromGoogle();
      }
      
      const serviceId = 
        service === 'drive' ? 'drive-1' : 
        service === 'gmail' ? 'gmail-1' : 'docs-1';
        
      await disconnectGoogleService(serviceId);
      setConnectedServices(prev => prev.filter(s => s !== service));
      toast.success(`${service} disconnected successfully`);
    } catch (error) {
      console.error(`Error disconnecting ${service}:`, error);
      toast.error(`Failed to disconnect ${service}`);
    }
  };

  return {
    isConnectingDrive,
    isConnectingGmail,
    isConnectingDocs,
    connectedServices,
    setConnectedServices,
    handleConnectDrive,
    handleConnectGmail,
    handleConnectDocs,
    handleDisconnect
  };
}
