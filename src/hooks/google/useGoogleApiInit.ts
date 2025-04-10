
import { useEffect } from 'react';
import { toast } from 'sonner';
import { CLIENT_ID, ENABLE_DEMO_MODE, DEBUG_HOST_INFO } from './googleAuthConfig';
import {
  loadGoogleApiScript,
  initializeGoogleApiClient
} from './googleApiLoader';

interface UseGoogleApiInitProps {
  gApiInitialized: boolean;
  setGApiInitialized: (initialized: boolean) => void;
  apiLoading: boolean;
  setApiLoading: (loading: boolean) => void;
  apiError: string | null;
  setApiError: (error: string | null) => void;
  initializationAttempts: number;
  setInitializationAttempts: (attempts: number) => void;
  setIsDemoMode: (demoMode: boolean) => void;
  hasCredentials: boolean;
}

export function useGoogleApiInit({
  gApiInitialized,
  setGApiInitialized,
  apiLoading,
  setApiLoading,
  apiError,
  setApiError,
  initializationAttempts,
  setInitializationAttempts,
  setIsDemoMode,
  hasCredentials
}: UseGoogleApiInitProps) {
  // Initialize the Google API client
  useEffect(() => {
    // Don't retry more than 3 times automatically
    if (initializationAttempts > 3) {
      return;
    }
    
    const initializeGoogleApi = async () => {
      setApiLoading(true);
      setApiError(null);
      
      // If no credentials are provided, immediately go to demo mode
      if (!hasCredentials) {
        console.log('No Google API credentials provided, using demo mode');
        setApiLoading(false);
        setApiError('Missing Google API credentials. Please check the configuration.');
        setIsDemoMode(true);
        return;
      }
      
      // Force clear browser storage of gapi-related data to prevent stale state
      try {
        // Clear localStorage items related to Google auth
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('gapi') || key.includes('google'))) {
            localStorage.removeItem(key);
          }
        }
        
        // Clear sessionStorage items related to Google auth
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (key.includes('gapi') || key.includes('google'))) {
            sessionStorage.removeItem(key);
          }
        }
        
        // Also try to clear all cookies related to Google auth
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.split('=');
          if (name && (name.trim().includes('gapi') || name.trim().includes('google'))) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
          }
        });
      } catch (e) {
        console.log('Error clearing storage:', e);
        // Continue anyway, this is just a precaution
      }
      
      loadGoogleApiScript(
        // On success loading script
        () => {
          initializeGoogleApiClient()
            .then(() => {
              setGApiInitialized(true);
              setApiLoading(false);
              setApiError(null);
              setIsDemoMode(false);
            })
            .catch((error) => {
              setApiLoading(false);
              
              // Provide more specific error message
              const errorMessage = error?.message || 'Unknown error';
              console.error('Google API initialization error:', errorMessage);
              console.log('Debug host info:', DEBUG_HOST_INFO);
              
              if (!CLIENT_ID || typeof CLIENT_ID !== 'string' || CLIENT_ID === '') {
                setApiError('Missing Google Client ID. Please check the configuration.');
              } else if (errorMessage.includes('invalid_client')) {
                setApiError(`Invalid client: Your domain (${DEBUG_HOST_INFO.currentHost}) is not authorized in Google Cloud Console.`);
              } else if (errorMessage.includes('idpiframe_initialization_failed')) {
                setApiError(`Google authentication initialization failed: Your domain (${DEBUG_HOST_INFO.currentHost}) must be authorized in Google Cloud Console.`);
              } else if (errorMessage.includes('403')) {
                setApiError('API key or client ID may be invalid. Please check your credentials.');
              } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
                setApiError('Network issue detected. Please check your internet connection.');
              } else if (errorMessage.includes('cookies')) {
                setApiError('Third-party cookies may be blocked by your browser. Please check your browser settings.');
              } else {
                setApiError(`Failed to initialize Google services: ${errorMessage}`);
              }
              
              // Enable demo mode when there's an API error
              setIsDemoMode(ENABLE_DEMO_MODE || true);
              // Fixed: Using a direct number instead of a function
              setInitializationAttempts(initializationAttempts + 1);
            });
        },
        // On error loading script
        (error) => {
          setApiLoading(false);
          setApiError('Failed to load Google services. Please check your internet connection and try again.');
          // Enable demo mode when there's an API error
          setIsDemoMode(true);
          // Fixed: Using a direct number instead of a function
          setInitializationAttempts(initializationAttempts + 1);
        }
      );
    };

    if (!gApiInitialized && (!apiError || initializationAttempts === 0)) {
      initializeGoogleApi();
    }
  }, [gApiInitialized, apiError, initializationAttempts, hasCredentials, setApiLoading, setApiError, setGApiInitialized, setIsDemoMode, setInitializationAttempts]);

  const retryInitialization = () => {
    console.log('Manually retrying Google API initialization');
    setApiLoading(true);
    setApiError(null);
    setGApiInitialized(false);
    setIsDemoMode(false);
    // Reset counter to allow for more attempts
    setInitializationAttempts(0);
  };

  return { retryInitialization };
}
