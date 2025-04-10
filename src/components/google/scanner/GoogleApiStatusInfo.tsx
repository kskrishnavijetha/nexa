
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GOOGLE_API_HELP_TEXT } from '@/hooks/google/googleAuthConfig';

interface GoogleApiStatusInfoProps {
  isApiLoading: boolean;
  apiError: string | null;
  gApiInitialized: boolean;
  retryInitialization: () => void;
  isDemoMode?: boolean;
}

export const GoogleApiStatusInfo: React.FC<GoogleApiStatusInfoProps> = ({
  isApiLoading,
  apiError,
  gApiInitialized,
  retryInitialization,
  isDemoMode = false
}) => {
  if (isApiLoading) {
    return (
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-500" />
          <AlertDescription className="text-blue-700">
            Initializing Google services. Please wait...
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  if (isDemoMode) {
    return (
      <Alert className="mb-4 bg-amber-50 border-amber-200">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-2 text-amber-500" />
            <AlertDescription className="text-amber-700">
              <strong>Running in demo mode</strong> - Using simulated data instead of real Google API
            </AlertDescription>
          </div>
          <div className="text-sm text-gray-600 ml-6 mb-2">
            <p className="mb-2">To use real Google services:</p>
            {GOOGLE_API_HELP_TEXT}
          </div>
        </div>
      </Alert>
    );
  }

  if (apiError) {
    return (
      <Alert className="mb-4 bg-red-50 border-red-200">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            <AlertDescription className="text-red-700">
              <strong>Google API Error:</strong> {apiError}
            </AlertDescription>
          </div>
          <div className="text-sm text-gray-600 ml-6 mb-2">
            {GOOGLE_API_HELP_TEXT}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center justify-center gap-2 mt-2"
              onClick={retryInitialization}
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex items-center justify-center gap-2 mt-2"
              onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
            >
              Open Google Console
            </Button>
          </div>
        </div>
      </Alert>
    );
  }

  if (!gApiInitialized && !isApiLoading && !isDemoMode) {
    return (
      <Alert className="mb-4 bg-amber-50 border-amber-200">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
            <AlertDescription className="text-amber-700">
              Failed to initialize Google services. Please refresh the page and try again.
            </AlertDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 mt-2"
            onClick={retryInitialization}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </Alert>
    );
  }

  return null;
};
