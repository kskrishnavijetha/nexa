
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
          <AlertCircle className="h-5 w-5 mr-2" />
          <AlertDescription>
            {apiError}
          </AlertDescription>
        </Alert>
        <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
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
