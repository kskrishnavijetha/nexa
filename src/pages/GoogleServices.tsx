
import React, { useEffect } from 'react';
import GoogleServicesPage from '@/components/GoogleServicesPage';
import { useGoogleAuth } from '@/hooks/google/useGoogleAuth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const GoogleServices: React.FC = () => {
  // Use the Google authorization hook
  const { isAuthenticated } = useGoogleAuth();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Additional authentication check
    if (!user) {
      console.log("GoogleServices: No user found, redirecting to sign-in");
      toast.error("Please sign in to access Google Services");
      navigate('/sign-in', { replace: true });
      return;
    }
    
    console.log("GoogleServices: User authenticated:", user.email);
  }, [user, navigate]);
  
  console.log("GoogleServices: Rendering page, isAuthenticated:", isAuthenticated);
  
  // Only render the page if authenticated
  if (!isAuthenticated) {
    console.log("GoogleServices: Not authenticated, returning null");
    return null;
  }
  
  console.log("GoogleServices: Rendering GoogleServicesPage component");
  return <GoogleServicesPage />;
};

export default GoogleServices;
