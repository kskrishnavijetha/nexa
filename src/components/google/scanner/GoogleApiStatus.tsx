
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleApiStatusProps {
  isApiLoading: boolean;
  gApiInitialized: boolean;
  retryInitialization: () => void;
}

export const GoogleApiStatus: React.FC<GoogleApiStatusProps> = ({
  isApiLoading,
  gApiInitialized,
  retryInitialization
}) => {
  if (!gApiInitialized && !isApiLoading) {
    return (
      <Alert className="mb-4 bg-amber-50 border-amber-200">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
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
