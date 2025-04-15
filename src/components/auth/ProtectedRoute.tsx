
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { hasActiveSubscription, shouldUpgrade, hasScansRemaining } from '@/utils/paymentService';
import { toast } from 'sonner';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state when authenticating
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If not authenticated, redirect to sign-in
  if (!user) {
    // Save the location they were trying to go to for later redirect
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // For pricing page, always allow access regardless of subscription status
  if (location.pathname === '/pricing') {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }

  // For pages that explicitly require active subscriptions or remaining scans
  // These paths will prompt subscription check and redirection if needed
  const strictSubscriptionPaths = [
    '/document-analysis/new', // Only redirect when trying to start a new scan
    '/google-services/new-scan', // Only redirect when trying to start a new scan
    '/slack-monitoring/new-scan', // Only redirect when trying to start a new scan
  ];
  
  // Check if the current path is one that strictly requires subscription
  const isStrictPath = strictSubscriptionPaths.some(path => location.pathname.includes(path));
  
  // Only check subscription status for strict subscription paths
  if (isStrictPath) {
    const hasSubscription = hasActiveSubscription(user.id);
    const needsUpgrade = shouldUpgrade(user.id);
    const hasScans = hasScansRemaining(user.id);
    
    // If on a strict path and doesn't have required subscription, redirect to pricing
    if ((!hasSubscription || needsUpgrade || !hasScans) && location.pathname !== '/pricing') {
      if (needsUpgrade) {
        toast.info('Your plan has reached its scan limit. Please select a new plan to continue.');
      } else if (!hasScans) {
        toast.info('You have no remaining scans. Please select a plan to continue.');
      } else {
        toast.info('Please select a subscription plan to continue');
      }
      return <Navigate to="/pricing" replace />;
    }
  }

  // User is authenticated, render the protected layout and outlet
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
