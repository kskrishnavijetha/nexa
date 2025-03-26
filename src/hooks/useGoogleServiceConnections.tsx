
import { useState } from 'react';
import { GoogleService } from '@/components/google/types';
import { connectGoogleService, disconnectGoogleService } from '@/utils/google/connectionService';
import { toast } from 'sonner';

export function useGoogleServiceConnections() {
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [isConnectingDocs, setIsConnectingDocs] = useState(false);
  const [isConnectingSharePoint, setIsConnectingSharePoint] = useState(false);
  const [isConnectingOutlook, setIsConnectingOutlook] = useState(false);
  const [isConnectingTeams, setIsConnectingTeams] = useState(false);
  const [connectedServices, setConnectedServices] = useState<GoogleService[]>([]);

  const handleConnectDrive = async () => {
    setIsConnectingDrive(true);
    try {
      // Mock Google OAuth flow - in a real app, this would redirect to Google
      // const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?...' 
      // window.location.href = authUrl;
      
      // For demo purposes, simulate successful connection
      const result = await connectGoogleService('drive-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev, 'drive']);
        toast.success('Google Drive connected successfully');
      }
    } catch (error) {
      console.error('Error connecting Drive:', error);
      toast.error('Failed to connect Google Drive');
    } finally {
      setIsConnectingDrive(false);
    }
  };
  
  const handleConnectGmail = async () => {
    setIsConnectingGmail(true);
    try {
      // Mock authentication
      const result = await connectGoogleService('gmail-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev, 'gmail']);
        toast.success('Gmail connected successfully');
      }
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      toast.error('Failed to connect Gmail');
    } finally {
      setIsConnectingGmail(false);
    }
  };
  
  const handleConnectDocs = async () => {
    setIsConnectingDocs(true);
    try {
      // Mock authentication
      const result = await connectGoogleService('docs-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev, 'docs']);
        toast.success('Google Docs connected successfully');
      }
    } catch (error) {
      console.error('Error connecting Docs:', error);
      toast.error('Failed to connect Google Docs');
    } finally {
      setIsConnectingDocs(false);
    }
  };
  
  const handleConnectSharePoint = async () => {
    setIsConnectingSharePoint(true);
    try {
      const result = await connectGoogleService('sharepoint-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev, 'sharepoint']);
        toast.success('SharePoint connected successfully');
      }
    } catch (error) {
      console.error('Error connecting SharePoint:', error);
      toast.error('Failed to connect SharePoint');
    } finally {
      setIsConnectingSharePoint(false);
    }
  };
  
  const handleConnectOutlook = async () => {
    setIsConnectingOutlook(true);
    try {
      const result = await connectGoogleService('outlook-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev, 'outlook']);
        toast.success('Outlook connected successfully');
      }
    } catch (error) {
      console.error('Error connecting Outlook:', error);
      toast.error('Failed to connect Outlook');
    } finally {
      setIsConnectingOutlook(false);
    }
  };
  
  const handleConnectTeams = async () => {
    setIsConnectingTeams(true);
    try {
      const result = await connectGoogleService('teams-1');
      if (result.data && result.data.connected) {
        setConnectedServices(prev => [...prev, 'teams']);
        toast.success('Teams connected successfully');
      }
    } catch (error) {
      console.error('Error connecting Teams:', error);
      toast.error('Failed to connect Teams');
    } finally {
      setIsConnectingTeams(false);
    }
  };
  
  const handleDisconnect = async (service: GoogleService) => {
    try {
      const serviceId = 
        service === 'drive' ? 'drive-1' : 
        service === 'gmail' ? 'gmail-1' : 
        service === 'docs' ? 'docs-1' :
        service === 'sharepoint' ? 'sharepoint-1' :
        service === 'outlook' ? 'outlook-1' : 'teams-1';
        
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
    isConnectingSharePoint,
    isConnectingOutlook,
    isConnectingTeams,
    connectedServices,
    setConnectedServices,
    handleConnectDrive,
    handleConnectGmail,
    handleConnectDocs,
    handleConnectSharePoint,
    handleConnectOutlook,
    handleConnectTeams,
    handleDisconnect
  };
}
