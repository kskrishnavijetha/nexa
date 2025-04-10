
import React from 'react';
import GoogleServicesPage from '@/components/GoogleServicesPage';
import { useGoogleAuth } from '@/hooks/google/useGoogleAuth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Add a global declaration for gapi
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const GoogleServices: React.FC = () => {
  // Use the Google authorization hook which now handles both app auth and Google OAuth
  const { isAuthenticated, apiLoading } = useGoogleAuth();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/sign-in', { replace: true });
    }
  }, [user, navigate]);
  
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
