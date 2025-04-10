
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GOOGLE_API_HELP_TEXT, DEBUG_HOST_INFO } from '@/hooks/google/googleAuthConfig';

interface GoogleCredentialsStatusProps {
  hasCredentials: boolean;
  retryInitialization: () => void;
}

export const GoogleCredentialsStatus: React.FC<GoogleCredentialsStatusProps> = ({
  hasCredentials,
  retryInitialization
}) => {
  if (!hasCredentials) {
    return (
      <Alert className="mb-4 bg-amber-50 border-amber-200">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <Lock className="h-4 w-4 mr-2 text-amber-500" />
            <AlertDescription className="text-amber-700">
              <strong>Missing Google API credentials</strong> - Please add your credentials to use Google services
            </AlertDescription>
          </div>
          <div className="text-sm text-gray-600 ml-6 mb-2">
            <p className="mb-2">To use Google services:</p>
            <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-2 whitespace-pre-wrap font-mono text-xs">
              {GOOGLE_API_HELP_TEXT}
            </div>
            <p>Your current domain: <code className="bg-gray-100 px-1 py-0.5 rounded">{DEBUG_HOST_INFO.currentHost}</code></p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex items-center justify-center gap-2 mt-2"
              onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
            >
              Open Google Console
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center justify-center gap-2 mt-2"
              onClick={retryInitialization}
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </Alert>
    );
  }
  
  return null;
};
