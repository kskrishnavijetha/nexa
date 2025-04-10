
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface GoogleApiLoadingProps {
  isApiLoading: boolean;
}

export const GoogleApiLoading: React.FC<GoogleApiLoadingProps> = ({
  isApiLoading
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
  
  return null;
};
