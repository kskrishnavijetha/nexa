
import React from 'react';
import GoogleServicesPage from '@/components/GoogleServicesPage';
import { useGoogleAuth } from '@/hooks/google/useGoogleAuth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Add a global declaration for gapi
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const GoogleServices: React.FC = () => {
  // Use the Google authorization hook which now handles both app auth and Google OAuth
  const { isAuthenticated, apiLoading, apiError, retryInitialization } = useGoogleAuth();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/sign-in', { replace: true });
    }
  }, [user, navigate]);
  
  // Handle retry initialization
  const handleRetry = () => {
    retryInitialization();
  };
  
  // Show error state if API failed to initialize
  if (apiError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <Alert variant="destructive" className="mb-4 max-w-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <AlertDescription className="text-sm">
              {apiError}
            </AlertDescription>
          </div>
        </Alert>
        <div className="text-center mb-4">
          <p className="text-gray-600 mb-2">
            This could be due to network issues or API configuration problems.
          </p>
          <p className="text-gray-600">
            Please check your internet connection and try again.
          </p>
        </div>
        <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }
  
  // Show loading state
  if (apiLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="flex items-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span className="text-lg">Initializing Google services...</span>
        </div>
        <p className="text-sm text-gray-600 max-w-md text-center">
          This may take a moment. We're connecting to Google's services to enable scanning features.
        </p>
      </div>
    );
  }
  
  // Only render the page if authenticated with our app
  return isAuthenticated ? (
    <div>
      <GoogleServicesPage />
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg">Loading authentication...</span>
    </div>
  );
};

export default GoogleServices;
