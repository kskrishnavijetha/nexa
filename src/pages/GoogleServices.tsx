
import React from 'react';
import GoogleServicesPage from '@/components/GoogleServicesPage';
import { toast } from 'sonner';

const GoogleServices: React.FC = () => {
  // Listen for Google authorization response
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get('code');
    const error = params.get('error');
    
    if (authCode) {
      // Successfully authorized
      toast.success('Google authorization successful!');
      // Clear URL parameters without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Try to auto-connect to Google services if coming from Google Auth
      if (window.localStorage) {
        window.localStorage.setItem('googleAuthCode', authCode);
        window.localStorage.setItem('googleAuthTimestamp', Date.now().toString());
        
        const requestedService = window.localStorage.getItem('requestedService');
        if (requestedService) {
          toast.info(`Connecting to ${requestedService}...`);
          // The connection will be handled in the GoogleServicesPage component
        }
      }
    } else if (error) {
      // Authorization failed
      toast.error('Google authorization failed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
  return <GoogleServicesPage />;
};

export default GoogleServices;
