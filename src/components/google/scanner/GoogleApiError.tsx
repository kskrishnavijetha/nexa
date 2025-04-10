
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GOOGLE_API_HELP_TEXT, DEBUG_HOST_INFO } from '@/hooks/google/googleAuthConfig';

interface GoogleApiErrorProps {
  apiError: string | null;
  retryInitialization: () => void;
}

export const GoogleApiError: React.FC<GoogleApiErrorProps> = ({
  apiError,
  retryInitialization
}) => {
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
            {apiError?.includes('idpiframe_initialization_failed') && (
              <p className="mb-2 text-amber-700">
                <strong>This is likely a domain authorization issue.</strong> Make sure your current domain is authorized in Google Cloud Console.
              </p>
            )}
            <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-2 whitespace-pre-wrap font-mono text-xs">
              {GOOGLE_API_HELP_TEXT}
            </div>
            <p>Your current domain: <code className="bg-gray-100 px-1 py-0.5 rounded">{DEBUG_HOST_INFO.currentHost}</code></p>
            {DEBUG_HOST_INFO.isLocalhost && (
              <p className="mt-2 text-amber-700">
                <strong>You're on localhost:</strong> Make sure to add <code className="bg-gray-100 px-1 py-0.5 rounded">{DEBUG_HOST_INFO.currentHost}</code> as an authorized JavaScript origin in the Google Cloud Console.
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center justify-center gap-2 mt-2"
              onClick={() => window.open('https://developers.google.com/identity/gsi/web/guides/overview', '_blank')}
            >
              Google Auth Documentation
            </Button>
          </div>
        </div>
      </Alert>
    );
  }
  
  return null;
};
