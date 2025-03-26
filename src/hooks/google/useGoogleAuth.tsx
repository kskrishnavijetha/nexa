
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Hook to handle Google authentication flow
 */
export function useGoogleAuth() {
  const [authData, setAuthData] = useState<{
    authCode: string | null;
    requestedService: string | null;
  }>({ authCode: null, requestedService: null });

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
          // Set the auth data in state
          setAuthData({
            authCode,
            requestedService
          });
        } else {
          // Clear expired auth data
          clearAuthData();
        }
      }
    }
    
    // No cleanup needed for this effect
    return;
  }, []);

  /**
   * Clear stored auth data from localStorage
   */
  const clearAuthData = () => {
    if (window.localStorage) {
      window.localStorage.removeItem('googleAuthCode');
      window.localStorage.removeItem('googleAuthTimestamp');
      window.localStorage.removeItem('requestedService');
      setAuthData({ authCode: null, requestedService: null });
    }
  };

  /**
   * Store requested service for authentication
   */
  const storeRequestedService = (service: string) => {
    if (window.localStorage) {
      window.localStorage.setItem('requestedService', service);
    }
  };

  return { 
    authData,
    clearAuthData,
    storeRequestedService 
  };
}
