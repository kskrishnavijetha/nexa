
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  
  useEffect(() => {
    // If not loading and no user, redirect to sign-in page
    if (!loading && !user && !isRedirecting) {
      console.log('ProtectedRoute: No authenticated user, redirecting to sign-in');
      setIsRedirecting(true);
      
      // Store the attempted URL for redirect after login
      if (location.pathname !== '/sign-in') {
        sessionStorage.setItem('redirectAfterLogin', location.pathname);
        console.log('Storing redirect path:', location.pathname);
      }
      
      // Use setTimeout to prevent UI flickering from immediate redirects
      const redirectTimer = setTimeout(() => {
        navigate('/sign-in', { replace: true });
      }, 300);
      
      return () => clearTimeout(redirectTimer);
    }
    
    // If we're stuck in a loading state for too long, reset the state
    if (loading && redirectAttempts < 3) {
      const timeoutId = setTimeout(() => {
        setRedirectAttempts(prev => prev + 1);
        console.log('Still loading, increment attempt count:', redirectAttempts + 1);
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
    
    // If we've tried several times and are still loading, force a navigation
    if (redirectAttempts >= 3 && loading) {
      console.log('Too many loading attempts, forcing navigation to sign-in');
      setIsRedirecting(true);
      navigate('/sign-in', { replace: true });
    }
  }, [user, loading, navigate, isRedirecting, location, redirectAttempts]);

  // Show loading state when authenticating or redirecting
  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Preparing your dashboard...</span>
      </div>
    );
  }

  // If not authenticated and not redirecting yet, show loading instead of flashing content
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Authenticating...</span>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
