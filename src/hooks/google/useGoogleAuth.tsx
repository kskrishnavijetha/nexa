
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Google API configuration
const CLIENT_ID = "714133727140-56bq1vafc1aps4s4nfb1h7bj1icdr3m4.apps.googleusercontent.com"; // Google Client ID
const API_KEY = ""; // You'll need to add your Google API Key
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

export function useGoogleAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [gApiInitialized, setGApiInitialized] = useState(false);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);

  // Initialize the Google API client
  useEffect(() => {
    const loadGoogleApi = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = initGoogleApi;
      document.body.appendChild(script);
    };

    if (!gApiInitialized) {
      loadGoogleApi();
    }
  }, [gApiInitialized]);

  const initGoogleApi = () => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(() => {
          console.log('Google API initialized');
          setGApiInitialized(true);
          
          // Check if user is already signed in
          if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
            setIsGoogleAuthenticated(true);
            console.log('User already signed in to Google');
          }
        })
        .catch(error => {
          console.error('Error initializing Google API:', error);
          toast.error('Failed to initialize Google services');
        });
    });
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
    gApiInitialized
  };
}
