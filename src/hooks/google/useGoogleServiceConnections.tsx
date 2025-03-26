
import { useState, useEffect } from 'react';
import { GoogleService } from '@/components/google/types';
import { toast } from 'sonner';
import { useGoogleAuth } from './useGoogleAuth';
import { useGoogleDriveConnection } from './useGoogleDriveConnection';
import { useGmailConnection } from './useGmailConnection';
import { useGoogleDocsConnection } from './useGoogleDocsConnection';
import { useMicrosoftConnections } from './useMicrosoftConnections';
import { useServiceDisconnection } from './useServiceDisconnection';

export function useGoogleServiceConnections() {
  // Get connection state and handlers from individual hooks
  const { isConnectingDrive, handleConnectDrive } = useGoogleDriveConnection();
  const { isConnectingGmail, handleConnectGmail } = useGmailConnection();
  const { isConnectingDocs, handleConnectDocs } = useGoogleDocsConnection();
  const {
    isConnectingSharePoint,
    isConnectingOutlook,
    isConnectingTeams,
    handleConnectSharePoint,
    handleConnectOutlook,
    handleConnectTeams
  } = useMicrosoftConnections();
  const { handleDisconnect } = useServiceDisconnection();
  
  const [connectedServices, setConnectedServices] = useState<GoogleService[]>([]);

  // Check for automatic connection after Google auth
  useEffect(() => {
    if (window.localStorage) {
      const authCode = window.localStorage.getItem('googleAuthCode');
      const timestamp = window.localStorage.getItem('googleAuthTimestamp');
      const requestedService = window.localStorage.getItem('requestedService');
      
      if (authCode && timestamp && requestedService) {
        // Only process if the auth code is recent (last 5 minutes)
        const authTime = parseInt(timestamp, 10);
        const currentTime = Date.now();
        const fiveMinutesInMs = 5 * 60 * 1000;
        
        if (currentTime - authTime < fiveMinutesInMs) {
          // Connect the requested service
          if (requestedService === 'drive') {
            handleConnectDriveWrapper(true);
          } else if (requestedService === 'gmail') {
            handleConnectGmailWrapper(true);
          } else if (requestedService === 'docs') {
            handleConnectDocsWrapper(true);
          }
          
          // Clear the stored auth data
          window.localStorage.removeItem('googleAuthCode');
          window.localStorage.removeItem('googleAuthTimestamp');
          window.localStorage.removeItem('requestedService');
        }
      }
    }
  }, []);

  // Wrapper functions to update the connectedServices state
  const handleConnectDriveWrapper = async (autoConnect = false) => {
    const connected = await handleConnectDrive(autoConnect);
    if (connected) {
      setConnectedServices(prev => {
        if (!prev.includes('drive')) {
          return [...prev, 'drive'];
        }
        return prev;
      });
      toast.success('Google Drive connected successfully');
    }
  };
  
  const handleConnectGmailWrapper = async (autoConnect = false) => {
    const connected = await handleConnectGmail(autoConnect);
    if (connected) {
      setConnectedServices(prev => {
        if (!prev.includes('gmail')) {
          return [...prev, 'gmail'];
        }
        return prev;
      });
      toast.success('Gmail connected successfully');
    }
  };
  
  const handleConnectDocsWrapper = async (autoConnect = false) => {
    const connected = await handleConnectDocs(autoConnect);
    if (connected) {
      setConnectedServices(prev => {
        if (!prev.includes('docs')) {
          return [...prev, 'docs'];
        }
        return prev;
      });
      toast.success('Google Docs connected successfully');
    }
  };
  
  const handleConnectSharePointWrapper = async () => {
    const connected = await handleConnectSharePoint();
    if (connected) {
      setConnectedServices(prev => {
        if (!prev.includes('sharepoint')) {
          return [...prev, 'sharepoint'];
        }
        return prev;
      });
    }
  };
  
  const handleConnectOutlookWrapper = async () => {
    const connected = await handleConnectOutlook();
    if (connected) {
      setConnectedServices(prev => {
        if (!prev.includes('outlook')) {
          return [...prev, 'outlook'];
        }
        return prev;
      });
    }
  };
  
  const handleConnectTeamsWrapper = async () => {
    const connected = await handleConnectTeams();
    if (connected) {
      setConnectedServices(prev => {
        if (!prev.includes('teams')) {
          return [...prev, 'teams'];
        }
        return prev;
      });
    }
  };
  
  const handleDisconnectWrapper = async (service: GoogleService) => {
    const success = await handleDisconnect(service);
    if (success) {
      setConnectedServices(prev => prev.filter(s => s !== service));
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
    handleConnectDrive: handleConnectDriveWrapper,
    handleConnectGmail: handleConnectGmailWrapper,
    handleConnectDocs: handleConnectDocsWrapper,
    handleConnectSharePoint: handleConnectSharePointWrapper,
    handleConnectOutlook: handleConnectOutlookWrapper,
    handleConnectTeams: handleConnectTeamsWrapper,
    handleDisconnect: handleDisconnectWrapper
  };
}
