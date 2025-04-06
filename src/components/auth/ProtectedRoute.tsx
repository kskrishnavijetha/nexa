
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { hasActiveSubscription } from '@/utils/paymentService';

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
        console.log('Storing redirect path:', location.pathname);
      }
      
      // Redirect immediately to sign-in
      navigate('/sign-in', { replace: true });
      return;
    }
    
    // Check if user has an active subscription on protected routes except pricing and payment pages
    if (!loading && user && !isRedirecting && 
        location.pathname !== '/payment' && 
        location.pathname !== '/pricing') {
      
      const hasSubscription = hasActiveSubscription();
      
      if (!hasSubscription) {
        console.log('ProtectedRoute: User has no active subscription, redirecting to pricing page');
        setIsRedirecting(true);
        
        // Redirect immediately to pricing page, not payment
        navigate('/pricing', { replace: true });
      }
    }
  }, [user, loading, navigate, isRedirecting, location]);

  // Show loading state when authenticating or redirecting
  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Preparing your dashboard...</span>
      </div>
    );
  }

  // User is authenticated, render the protected content
  if (user) {
    return <>{children}</>;
  }

  // If not authenticated and not redirecting yet, show loading instead of flashing content
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
      <span className="ml-2">Authenticating...</span>
    </div>
  );
};

export default ProtectedRoute;
