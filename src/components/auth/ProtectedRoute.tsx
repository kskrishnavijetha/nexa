
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { hasActiveSubscription } from '@/utils/paymentService';
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

  // If user is authenticated but doesn't have an active subscription
  // and they're not already on the pricing page, redirect to pricing
  const hasSubscription = hasActiveSubscription();
  if (!hasSubscription && location.pathname !== '/pricing') {
    toast.info('Please select a subscription plan to continue');
    return <Navigate to="/pricing" replace />;
  }

  // User is authenticated and has a subscription, render the protected layout and outlet
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
