
import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Hook to handle Google authentication flow
 */
export function useGoogleAuth() {
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
          // Clear the stored auth data after it's processed by useGoogleServiceConnections
          return {
            authCode,
            requestedService,
            clearAuthData: () => {
              window.localStorage.removeItem('googleAuthCode');
              window.localStorage.removeItem('googleAuthTimestamp');
              window.localStorage.removeItem('requestedService');
            }
          };
        } else {
          // Clear expired auth data
          window.localStorage.removeItem('googleAuthCode');
          window.localStorage.removeItem('googleAuthTimestamp');
          window.localStorage.removeItem('requestedService');
        }
      }
    }
    
    return { authCode: null, requestedService: null, clearAuthData: () => {} };
  }, []);

  /**
   * Store requested service for authentication
   */
  const storeRequestedService = (service: string) => {
    if (window.localStorage) {
      window.localStorage.setItem('requestedService', service);
    }
  };

  return { storeRequestedService };
}
