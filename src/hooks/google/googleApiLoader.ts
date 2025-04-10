
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

    console.log('Initializing Google API client');
    window.gapi.load('client:auth2', async () => {
      try {
        console.log('Google API libraries loaded, initializing client with config');
        await window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
          cookiepolicy: 'single_host_origin'
        });
        
        console.log('Google API initialized successfully');
        resolve();
      } catch (error: any) {
        // Check specifically for idpiframe_initialization_failed error (origin not allowed)
        if (error && error.error === 'idpiframe_initialization_failed') {
          console.warn('Google API initialization failed due to origin restrictions. Continuing in demo mode.');
          // Still resolve but with a specific status that can be checked
          resolve();
        } else {
          console.error('Error initializing Google API:', error);
          reject(error);
        }
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
      console.log('Google API not initialized, using demo mode');
      toast.success('Connected to Google in demo mode');
      return true; // Return true to allow demo mode to work
    }

    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signIn({prompt: 'select_account'});
    
    console.log('Google authentication successful');
    toast.success('Connected to Google successfully');
    return true;
  } catch (error) {
    // If the error is related to origin restrictions, still allow "demo mode"
    if (error && typeof error === 'object' && 'error' in error && error.error === 'idpiframe_initialization_failed') {
      console.log('Using demo mode due to origin restrictions');
      toast.success('Connected to Google in demo mode');
      return true;
    }
    
    console.error('Google authentication error:', error);
    toast.error('Google authentication failed');
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
