
import React, { useEffect } from 'react';
import GoogleServicesPage from '@/components/GoogleServicesPage';
import { useGoogleAuth } from '@/hooks/google/useGoogleAuth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const GoogleServices: React.FC = () => {
  // Use the Google authorization hook
  const { isAuthenticated } = useGoogleAuth();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Additional authentication check
    if (!user) {
      navigate('/sign-in', { replace: true });
    }
  }, [user, navigate]);
  
  // Only render the page if authenticated
  return isAuthenticated ? <GoogleServicesPage /> : null;
};

export default GoogleServices;
