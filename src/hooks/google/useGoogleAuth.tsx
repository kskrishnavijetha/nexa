
import { useEffect } from 'react';
import { useGoogleAuthState } from './useGoogleAuthState';
import { useGoogleApiInit } from './useGoogleApiInit';
import { useGoogleAuthActions } from './useGoogleAuthActions';
import { useAppAuthRedirect } from './useAppAuthRedirect';

export function useGoogleAuth() {
  // Get authentication state
  const authState = useGoogleAuthState();
  
  // Handle app authentication and redirect
  const { isAuthenticated } = useAppAuthRedirect();

  // Initialize Google API
  const { retryInitialization } = useGoogleApiInit({
    gApiInitialized: authState.gApiInitialized,
    setGApiInitialized: authState.setGApiInitialized,
    apiLoading: authState.apiLoading,
    setApiLoading: authState.setApiLoading,
    apiError: authState.apiError,
    setApiError: authState.setApiError,
    initializationAttempts: authState.initializationAttempts,
    setInitializationAttempts: authState.setInitializationAttempts,
    setIsDemoMode: authState.setIsDemoMode,
    hasCredentials: authState.hasCredentials,
  });

  // Set up Google authentication actions
  const { 
    signInToGoogle, 
    signOutFromGoogle, 
    checkGoogleAuthStatus 
  } = useGoogleAuthActions({
    gApiInitialized: authState.gApiInitialized,
    isDemoMode: authState.isDemoMode,
    setIsGoogleAuthenticated: authState.setIsGoogleAuthenticated,
  });
  
  // Check for existing Google authentication on component mount
  useEffect(() => {
    if (authState.gApiInitialized) {
      checkGoogleAuthStatus();
    }
  }, [authState.gApiInitialized]);

  return { 
    isAuthenticated, 
    isGoogleAuthenticated: authState.isGoogleAuthenticated, 
    signInToGoogle, 
    signOutFromGoogle,
    gApiInitialized: authState.gApiInitialized,
    apiLoading: authState.apiLoading,
    apiError: authState.apiError,
    retryInitialization,
    isDemoMode: authState.isDemoMode,
    hasCredentials: authState.hasCredentials,
    hasApiKey: authState.hasApiKey
  };
}
