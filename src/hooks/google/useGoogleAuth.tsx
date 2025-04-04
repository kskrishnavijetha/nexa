
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function useGoogleAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (authChecked) return;
    
    console.log("useGoogleAuth: Checking authentication, user:", user?.email);
    setAuthChecked(true);
    
    if (!user) {
      console.log('useGoogleAuth: User not authenticated, redirecting to sign-in page');
      toast.error('Please sign in to access Cloud Services Scanner');
      navigate('/sign-in', { replace: true });
      setIsAuthenticated(false);
    } else {
      console.log('useGoogleAuth: User authenticated, can access Cloud Services Scanner');
      setIsAuthenticated(true);
    }
  }, [user, navigate, authChecked]);

  // If user changes, update authentication state
  useEffect(() => {
    if (user) {
      console.log('useGoogleAuth: User changed, updating authentication state to true');
      setIsAuthenticated(true);
    } else {
      console.log('useGoogleAuth: User changed, updating authentication state to false');
      setIsAuthenticated(false);
    }
  }, [user]);

  return { isAuthenticated };
}
