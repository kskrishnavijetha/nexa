
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [timeoutCounter, setTimeoutCounter] = useState(0);
  
  // Debug helper for tracking state changes
  useEffect(() => {
    console.log('ProtectedRoute state:', { user: !!user, loading, isRedirecting, redirectAttempts, timeoutCounter, path: location.pathname });
  }, [user, loading, isRedirecting, redirectAttempts, timeoutCounter, location.pathname]);
  
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
      toast.error("Authentication is taking longer than expected. Please sign in again.");
      setIsRedirecting(true);
      navigate('/sign-in', { replace: true });
    }
    
    // Add a safety timeout for entire component
    if (timeoutCounter === 0) {
      const globalTimeout = setTimeout(() => {
        setTimeoutCounter(1);
        if (loading || !user) {
          console.log('Global timeout reached, forcing navigation');
          toast.error("Authentication timed out. Please sign in again.");
          navigate('/sign-in', { replace: true });
        }
      }, 10000); // 10 second global timeout
      
      return () => clearTimeout(globalTimeout);
    }
  }, [user, loading, navigate, isRedirecting, location, redirectAttempts, timeoutCounter]);

  // Show loading state when authenticating or redirecting
  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <Loader2 className="animate-spin h-8 w-8 text-primary mb-2" />
        <span>Preparing your dashboard...</span>
        {redirectAttempts > 1 && (
          <p className="text-sm text-muted-foreground mt-2">
            This is taking longer than expected...
          </p>
        )}
        {redirectAttempts > 2 && (
          <button 
            className="mt-4 text-sm text-primary underline"
            onClick={() => navigate('/sign-in', { replace: true })}
          >
            Click here to sign in again
          </button>
        )}
      </div>
    );
  }

  // If not authenticated and not redirecting yet, show loading instead of flashing content
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <Loader2 className="animate-spin h-8 w-8 text-primary mb-2" />
        <span>Authenticating...</span>
        <button 
          className="mt-4 text-sm text-primary underline"
          onClick={() => navigate('/sign-in', { replace: true })}
        >
          Click here to sign in
        </button>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
