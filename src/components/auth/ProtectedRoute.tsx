
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { hasActiveSubscription, shouldUpgrade } from '@/utils/paymentService';
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

  // Check for both missing and expired/completed plans with user ID
  // But only if they're not already on the pricing page
  const hasSubscription = hasActiveSubscription(user.id);
  const needsUpgrade = shouldUpgrade(user.id);
  
  // If user is authenticated but doesn't have an active subscription
  // or needs to upgrade and they're not already on the pricing page, redirect to pricing
  if ((!hasSubscription || needsUpgrade) && location.pathname !== '/pricing') {
    if (needsUpgrade) {
      toast.info('Your plan has expired or reached its scan limit. Please select a new plan to continue.');
    } else {
      toast.info('Please select a subscription plan to continue');
    }
    return <Navigate to="/pricing" replace />;
  }

  // User is authenticated and has a valid subscription, render the protected layout and outlet
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
