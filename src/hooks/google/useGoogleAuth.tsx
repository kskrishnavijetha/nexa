
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

export function useGoogleAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [gApiInitialized, setGApiInitialized] = useState(false);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [initializationAttempts, setInitializationAttempts] = useState(0);

  // Initialize the Google API client
  useEffect(() => {
    // Don't retry more than 3 times automatically
    if (initializationAttempts > 3) {
      return;
    }
    
    const initializeGoogleApi = () => {
      setApiLoading(true);
      setApiError(null);
      
      loadGoogleApiScript(
        // On success loading script
        () => {
          initializeGoogleApiClient()
            .then(() => {
              setGApiInitialized(true);
              setApiLoading(false);
              setApiError(null);
              
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
              if (errorMessage.includes('403') || errorMessage.includes('invalid_client')) {
                setApiError('API key or client ID may be invalid. Please check your credentials.');
              } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
                setApiError('Network issue detected. Please check your internet connection.');
              } else {
                setApiError('Failed to initialize Google services. Please try again or check your API credentials.');
              }
              
              setInitializationAttempts(prev => prev + 1);
            });
        },
        // On error loading script
        (error) => {
          setApiLoading(false);
          setApiError('Failed to load Google services. Please check your internet connection and try again.');
          setInitializationAttempts(prev => prev + 1);
        }
      );
    };

    if (!gApiInitialized && !apiError) {
      initializeGoogleApi();
    }
  }, [gApiInitialized, apiError, initializationAttempts]);

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
    setInitializationAttempts(0);
  };

  // Sign in to Google
  const signInToGoogle = async () => {
    const success = await googleSignIn();
    if (success) {
      setIsGoogleAuthenticated(true);
    }
    return success;
  };

  // Sign out from Google
  const signOutFromGoogle = async () => {
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
    retryInitialization
  };
}
