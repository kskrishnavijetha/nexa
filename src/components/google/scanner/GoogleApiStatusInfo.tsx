
import React from 'react';
import { GoogleApiLoading } from './GoogleApiLoading';
import { GoogleApiError } from './GoogleApiError';
import { GoogleApiStatus } from './GoogleApiStatus';
import { GoogleCredentialsStatus } from './GoogleCredentialsStatus';
import { GoogleDemoModeAlert } from './GoogleDemoModeAlert';

interface GoogleApiStatusInfoProps {
  isApiLoading: boolean;
  apiError: string | null;
  gApiInitialized: boolean;
  retryInitialization: () => void;
  isDemoMode?: boolean;
  hasCredentials?: boolean;
}

export const GoogleApiStatusInfo: React.FC<GoogleApiStatusInfoProps> = ({
  isApiLoading,
  apiError,
  gApiInitialized,
  retryInitialization,
  isDemoMode = false,
  hasCredentials = false
}) => {
  return (
    <>
      <GoogleApiLoading isApiLoading={isApiLoading} />
      <GoogleCredentialsStatus 
        hasCredentials={hasCredentials} 
        retryInitialization={retryInitialization} 
      />
      <GoogleDemoModeAlert 
        isDemoMode={isDemoMode} 
        apiError={apiError}
        retryInitialization={retryInitialization}
      />
      <GoogleApiError 
        apiError={apiError}
        retryInitialization={retryInitialization}
      />
      <GoogleApiStatus 
        isApiLoading={isApiLoading}
        gApiInitialized={gApiInitialized}
        retryInitialization={retryInitialization}
      />
    </>
  );
};
