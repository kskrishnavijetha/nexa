
import { toast } from 'sonner';
import { CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES } from './googleAuthConfig';

// Add global type declaration for gapi
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

/**
 * Loads the Google API script if it's not already loaded
 */
export const loadGoogleApiScript = (
  onSuccess: () => void,
  onError: (error: any) => void
): void => {
  if (window.gapi) {
    console.log('Google API script already loaded, initializing client');
    onSuccess();
    return;
  }

  console.log('Loading Google API script');
  
  // Remove any existing failed script elements
  const existingScript = document.querySelector('script[src*="apis.google.com"]');
  if (existingScript) {
    document.body.removeChild(existingScript);
  }
  
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    console.log('Google API script loaded successfully');
    onSuccess();
  };
  script.onerror = (error) => {
    console.error('Error loading Google API script:', error);
    onError(error);
  };
  
  document.body.appendChild(script);
};

/**
 * Initializes the Google API client
 */
export const initializeGoogleApiClient = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.gapi) {
      reject(new Error('Google API script failed to provide window.gapi'));
      return;
    }

    // Check if client ID is configured
    if (!CLIENT_ID || CLIENT_ID.length === 0) {
      reject(new Error('Google Client ID not configured. Please set a valid Client ID.'));
      return;
    }

    console.log('Initializing Google API client');
    window.gapi.load('client:auth2', async () => {
      try {
        console.log('Google API libraries loaded, initializing client with config');
        const clientConfig: any = {
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
          cookiepolicy: 'single_host_origin'
        };
        
        // Only add API key if it's provided
        if (API_KEY && API_KEY.length > 0) {
          clientConfig.apiKey = API_KEY;
        }
        
        await window.gapi.client.init(clientConfig);
        
        console.log('Google API initialized successfully');
        resolve();
      } catch (error: any) {
        console.error('Error initializing Google API:', error);
        const errorMessage = error?.error || error?.message || 'Unknown error';
        reject(new Error(`Google API initialization failed: ${errorMessage}`));
      }
    });
  });
};

/**
 * Checks if user is already signed in to Google
 */
export const isUserSignedInToGoogle = (): boolean => {
  if (!window.gapi || !window.gapi.auth2) return false;
  
  try {
    return window.gapi.auth2.getAuthInstance().isSignedIn.get();
  } catch (error) {
    console.error('Error checking Google sign-in status:', error);
    return false;
  }
};

/**
 * Sign in to Google
 */
export const signInToGoogle = async (): Promise<boolean> => {
  try {
    if (!window.gapi || !window.gapi.auth2) {
      console.log('Google API not initialized');
      toast.error('Google API not properly initialized');
      return false;
    }

    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signIn({prompt: 'select_account'});
    
    console.log('Google authentication successful');
    toast.success('Connected to Google successfully');
    return true;
  } catch (error: any) {
    console.error('Google authentication error:', error);
    
    // Provide more helpful error messages based on error type
    if (error?.error === 'popup_blocked_by_browser') {
      toast.error('Google sign-in popup was blocked. Please allow popups for this site.');
    } else if (error?.error === 'access_denied') {
      toast.error('Google access was denied. Please grant the required permissions.');
    } else if (error?.error === 'idpiframe_initialization_failed' || error?.error === 'invalid_client') {
      toast.error('Invalid Google client configuration. The domain may not be authorized.');
    } else {
      toast.error(`Google authentication failed: ${error?.error || 'Unknown error'}`);
    }
    
    return false;
  }
};

/**
 * Sign out from Google
 */
export const signOutFromGoogle = async (): Promise<boolean> => {
  try {
    if (!window.gapi || !window.gapi.auth2) return true;

    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    
    console.log('Signed out from Google');
    return true;
  } catch (error) {
    console.error('Google sign out error:', error);
    return false;
  }
};
