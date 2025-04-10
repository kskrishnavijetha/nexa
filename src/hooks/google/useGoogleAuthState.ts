
import { useState } from 'react';
import { CLIENT_ID, API_KEY, ENABLE_DEMO_MODE } from './googleAuthConfig';

export function useGoogleAuthState() {
  const [authChecked, setAuthChecked] = useState(false);
  const [gApiInitialized, setGApiInitialized] = useState(false);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(ENABLE_DEMO_MODE);

  // Check if credentials are actually provided with type-safe check
  const hasCredentials = !!CLIENT_ID && typeof CLIENT_ID === 'string' && CLIENT_ID !== '';
  // Check if we have an API key
  const hasApiKey = !!API_KEY && typeof API_KEY === 'string' && API_KEY !== '';

  return {
    authChecked,
    setAuthChecked,
    gApiInitialized,
    setGApiInitialized,
    isGoogleAuthenticated,
    setIsGoogleAuthenticated,
    apiLoading,
    setApiLoading,
    apiError,
    setApiError,
    initializationAttempts,
    setInitializationAttempts,
    isDemoMode,
    setIsDemoMode,
    hasCredentials,
    hasApiKey
  };
}
