
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Google API configuration
const CLIENT_ID = "714133727140-56bq1vafc1aps4s4nfb1h7bj1icdr3m4.apps.googleusercontent.com"; // Google Client ID
const API_KEY = "AIzaSyCw2nTK_NMP8Eg3X94eF1L3BA0T_hLo9J8"; // Google API Key
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

// Add global type declaration for gapi
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export function useGoogleAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [gApiInitialized, setGApiInitialized] = useState(false);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Initialize the Google API client
  useEffect(() => {
    let scriptLoaded = false;
    let scriptAttempts = 0;
    const MAX_ATTEMPTS = 3;

    const loadGoogleApi = () => {
      if (window.gapi) {
        console.log('Google API script already loaded, initializing client');
        initGoogleApi();
        return;
      }

      if (scriptAttempts >= MAX_ATTEMPTS) {
        console.error('Failed to load Google API after multiple attempts');
        setApiError('Failed to load Google services after multiple attempts');
        setApiLoading(false);
        return;
      }

      scriptAttempts++;
      console.log(`Loading Google API script (attempt ${scriptAttempts})`);
      setApiLoading(true);
      setApiError(null);
      
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google API script loaded successfully');
        scriptLoaded = true;
        initGoogleApi();
      };
      script.onerror = (error) => {
        console.error('Error loading Google API script:', error);
        setApiLoading(false);
        setApiError('Failed to load Google services. Please check your internet connection and try again.');
        
        // Retry after a delay
        setTimeout(() => {
          if (scriptAttempts < MAX_ATTEMPTS) {
            document.body.removeChild(script);
            loadGoogleApi();
          }
        }, 2000);
      };
      
      document.body.appendChild(script);
    };

    const initGoogleApi = () => {
      if (!window.gapi) {
        console.error('Google API script failed to provide window.gapi');
        setApiLoading(false);
        setApiError('Failed to initialize Google services');
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
          });
          
          console.log('Google API initialized successfully');
          setGApiInitialized(true);
          setApiLoading(false);
          setApiError(null);
          
          // Check if user is already signed in
          if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
            console.log('User already signed in to Google');
            setIsGoogleAuthenticated(true);
          } else {
            console.log('User not signed in to Google');
          }
        } catch (error) {
          console.error('Error initializing Google API:', error);
          setApiLoading(false);
          setApiError('Failed to initialize Google services. Please try again or check your API credentials.');
        }
      });
    };

    if (!gApiInitialized && !scriptLoaded && !apiError) {
      loadGoogleApi();
    }

    // Cleanup function
    return () => {
      // No cleanup needed for script loading
    };
  }, [gApiInitialized, apiError]);

  // Retry initialization
  const retryInitialization = () => {
    console.log('Retrying Google API initialization');
    setApiLoading(true);
    setApiError(null);
    setGApiInitialized(false);
  };

  // Check if user is authenticated with our app
  useEffect(() => {
    if (authChecked) return;
    
    setAuthChecked(true);
    
    if (!user) {
      console.log('User not authenticated, redirecting to sign-in page');
      toast.error('Please sign in to access Cloud Services Scanner');
      navigate('/sign-in', { replace: true });
    } else {
      console.log('User authenticated, can access Cloud Services Scanner');
    }
  }, [user, navigate, authChecked]);

  // Sign in to Google
  const signInToGoogle = async () => {
    try {
      if (!gApiInitialized) {
        toast.error('Google API not initialized yet');
        return false;
      }

      const authInstance = window.gapi.auth2.getAuthInstance();
      const googleUser = await authInstance.signIn();
      setIsGoogleAuthenticated(true);
      
      console.log('Google authentication successful');
      toast.success('Connected to Google successfully');
      return true;
    } catch (error) {
      console.error('Google authentication error:', error);
      toast.error('Google authentication failed');
      return false;
    }
  };

  // Sign out from Google
  const signOutFromGoogle = async () => {
    try {
      if (!gApiInitialized) return;

      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      setIsGoogleAuthenticated(false);
      
      console.log('Signed out from Google');
      return true;
    } catch (error) {
      console.error('Google sign out error:', error);
      return false;
    }
  };

  return { 
    isAuthenticated: !!user, 
    isGoogleAuthenticated, 
    signInToGoogle, 
    signOutFromGoogle,
    gApiInitialized,
    apiLoading,
    apiError,
    retryInitialization
  };
}
