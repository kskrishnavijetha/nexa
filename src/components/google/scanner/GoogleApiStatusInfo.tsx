
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleApiStatusInfoProps {
  isApiLoading: boolean;
  apiError: string | null;
  gApiInitialized: boolean;
  retryInitialization: () => void;
}

export const GoogleApiStatusInfo: React.FC<GoogleApiStatusInfoProps> = ({
  isApiLoading,
  apiError,
  gApiInitialized,
  retryInitialization
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

  if (apiError) {
    return (
      <Alert className="mb-4 bg-red-50 border-red-200">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            <AlertDescription className="text-red-700">
              {apiError}
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

  if (!gApiInitialized && !isApiLoading) {
    return (
      <Alert className="mb-4 bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
        <AlertDescription className="text-amber-700">
          Failed to initialize Google services. Please refresh the page and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
