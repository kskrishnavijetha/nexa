
import React, { useEffect } from 'react';
import GoogleServicesPage from '@/components/GoogleServicesPage';
import { useGoogleAuth } from '@/hooks/google/useGoogleAuth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Add a global declaration for gapi
declare global {
  interface Window {
    gapi: any;
  }
}

const GoogleServices: React.FC = () => {
  // Use the Google authorization hook which now handles both app auth and Google OAuth
  const { isAuthenticated, gApiInitialized } = useGoogleAuth();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Additional authentication check
    if (!user) {
      navigate('/sign-in', { replace: true });
    }
  }, [user, navigate]);
  
  // Only render the page if authenticated with our app
  return isAuthenticated ? (
    <div>
      {!gApiInitialized && (
        <div className="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg">
          Initializing Google services...
        </div>
      )}
      <GoogleServicesPage />
    </div>
  ) : null;
};

export default GoogleServices;
