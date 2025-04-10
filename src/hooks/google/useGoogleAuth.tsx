
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  loadGoogleApiScript,
  initializeGoogleApiClient,
  isUserSignedInToGoogle,
  signInToGoogle as googleSignIn,
  signOutFromGoogle as googleSignOut
} from './googleApiLoader';
import { CLIENT_ID, API_KEY, GOOGLE_API_HELP_TEXT, ENABLE_DEMO_MODE, DEBUG_HOST_INFO } from './googleAuthConfig';

export function useGoogleAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [gApiInitialized, setGApiInitialized] = useState(false);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(ENABLE_DEMO_MODE);

  // Check if credentials are actually provided
  const hasCredentials = !!CLIENT_ID && CLIENT_ID.length > 0;

  // Initialize the Google API client
  useEffect(() => {
    // Don't retry more than 3 times automatically
    if (initializationAttempts > 3) {
      return;
    }
    
    const initializeGoogleApi = () => {
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
      
      loadGoogleApiScript(
        // On success loading script
        () => {
          initializeGoogleApiClient()
            .then(() => {
              setGApiInitialized(true);
              setApiLoading(false);
              setApiError(null);
              setIsDemoMode(false);
              
              // Check if user is already signed in
              if (isUserSignedInToGoogle()) {
                console.log('User already signed in to Google');
                setIsGoogleAuthenticated(true);
              } else {
                console.log('User not signed in to Google');
              }
            })
            .catch((error) => {
              setApiLoading(false);
              
              // Provide more specific error message
              const errorMessage = error?.message || 'Unknown error';
              console.error('Google API initialization error:', errorMessage);
              console.log('Debug host info:', DEBUG_HOST_INFO);
              
              if (!CLIENT_ID || CLIENT_ID.length === 0) {
                setApiError('Missing Google Client ID. Please check the configuration.');
              } else if (errorMessage.includes('invalid_client')) {
                setApiError(`Invalid client: Your domain (${DEBUG_HOST_INFO.currentHost}) may not be authorized in Google Cloud Console.`);
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
              setIsDemoMode(ENABLE_DEMO_MODE);
              setInitializationAttempts(prev => prev + 1);
            });
        },
        // On error loading script
        (error) => {
          setApiLoading(false);
          setApiError('Failed to load Google services. Please check your internet connection and try again.');
          // Enable demo mode when there's an API error
          setIsDemoMode(ENABLE_DEMO_MODE);
          setInitializationAttempts(prev => prev + 1);
        }
      );
    };

    if (!gApiInitialized && (!apiError || initializationAttempts === 0)) {
      initializeGoogleApi();
    }
  }, [gApiInitialized, apiError, initializationAttempts, hasCredentials]);

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

  // Retry initialization manually
  const retryInitialization = () => {
    console.log('Manually retrying Google API initialization');
    setApiLoading(true);
    setApiError(null);
    setGApiInitialized(false);
    setIsDemoMode(false);
    // Reset counter to allow for more attempts
    setInitializationAttempts(0);
  };

  // Sign in to Google
  const signInToGoogle = async () => {
    if (!gApiInitialized && !isDemoMode) {
      toast.error('Google API not initialized yet. Please try again after the API initializes.');
      return false;
    }
    
    if (isDemoMode) {
      console.log('Demo mode: Simulating Google sign-in');
      setIsGoogleAuthenticated(true);
      toast.success('Connected to Google in demo mode');
      return true;
    }
    
    const success = await googleSignIn();
    if (success) {
      setIsGoogleAuthenticated(true);
    }
    return success;
  };

  // Sign out from Google
  const signOutFromGoogle = async () => {
    if (isDemoMode) {
      console.log('Demo mode: Simulating Google sign-out');
      setIsGoogleAuthenticated(false);
      return true;
    }
    
    const success = await googleSignOut();
    if (success) {
      setIsGoogleAuthenticated(false);
    }
    return success;
  };

  return { 
    isAuthenticated: !!user, 
    isGoogleAuthenticated, 
    signInToGoogle, 
    signOutFromGoogle,
    gApiInitialized,
    apiLoading,
    apiError,
    retryInitialization,
    isDemoMode,
    hasCredentials
  };
}
