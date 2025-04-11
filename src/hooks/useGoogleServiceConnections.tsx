
import { useState, useEffect } from 'react';
import { GoogleService } from '@/components/google/types';
import { connectGoogleService, disconnectGoogleService } from '@/utils/google/connectionService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useGoogleServiceConnections() {
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [isConnectingDocs, setIsConnectingDocs] = useState(false);
  const [connectedServices, setConnectedServices] = useState<GoogleService[]>([]);
  const { user } = useAuth();

  // Clear connections if user signs out
  useEffect(() => {
    if (!user) {
      setConnectedServices([]);
    }
  }, [user]);

  const handleConnectDrive = async () => {
    if (!user) {
      toast.error('Please sign in to connect services');
      return;
    }
    
    setIsConnectingDrive(true);
    try {
      // Mock Google OAuth flow - in a real app, this would redirect to Google
      // const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?...' 
      // window.location.href = authUrl;
      
      // For demo purposes, simulate successful connection
      const result = await connectGoogleService('drive-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev.filter(s => s !== 'drive'), 'drive']);
        toast.success('Google Drive connected successfully');
      } else if (result.error) {
        toast.error(`Failed to connect: ${result.error}`);
      }
    } catch (error) {
      console.error('Error connecting Drive:', error);
      toast.error('Failed to connect Google Drive');
    } finally {
      setIsConnectingDrive(false);
    }
  };
  
  const handleConnectGmail = async () => {
    if (!user) {
      toast.error('Please sign in to connect services');
      return;
    }
    
    setIsConnectingGmail(true);
    try {
      // Mock authentication
      const result = await connectGoogleService('gmail-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev.filter(s => s !== 'gmail'), 'gmail']);
        toast.success('Gmail connected successfully');
      } else if (result.error) {
        toast.error(`Failed to connect: ${result.error}`);
      }
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      toast.error('Failed to connect Gmail');
    } finally {
      setIsConnectingGmail(false);
    }
  };
  
  const handleConnectDocs = async () => {
    if (!user) {
      toast.error('Please sign in to connect services');
      return;
    }
    
    setIsConnectingDocs(true);
    try {
      // Mock authentication
      const result = await connectGoogleService('docs-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev.filter(s => s !== 'docs'), 'docs']);
        toast.success('Google Docs connected successfully');
      } else if (result.error) {
        toast.error(`Failed to connect: ${result.error}`);
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
