
import React from 'react';
import { GoogleStatusComponents } from './GoogleStatusComponents';

interface GoogleApiStatusInfoProps {
  isApiLoading: boolean;
  apiError: string | null;
  gApiInitialized: boolean;
  retryInitialization: () => void;
  isDemoMode?: boolean;
  hasCredentials?: boolean;
}

export const GoogleApiStatusInfo: React.FC<GoogleApiStatusInfoProps> = (props) => {
  return <GoogleStatusComponents {...props} />;
};
