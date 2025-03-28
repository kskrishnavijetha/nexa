
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
  
  useEffect(() => {
    // If not loading and no user, redirect to sign-in page
    if (!loading && !user && !isRedirecting) {
      console.log('ProtectedRoute: No authenticated user, redirecting to sign-in');
      setIsRedirecting(true);
      
      // Store the attempted URL for redirect after login
      if (location.pathname !== '/sign-in') {
        sessionStorage.setItem('redirectAfterLogin', location.pathname);
      }
      
      // Use setTimeout to prevent UI flickering from immediate redirects
      const redirectTimer = setTimeout(() => {
        navigate('/sign-in', { replace: true });
      }, 300);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, loading, navigate, isRedirecting, location]);

  // Show loading state when authenticating or redirecting
  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // If not authenticated and not redirecting yet, show loading instead of flashing content
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
