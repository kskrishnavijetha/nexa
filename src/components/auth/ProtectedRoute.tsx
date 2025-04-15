
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { hasActiveSubscription, shouldUpgrade } from '@/utils/paymentService';
import { toast } from 'sonner';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(true);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  
  // Check subscription status when user is authenticated
  useEffect(() => {
    async function checkSubscription() {
      if (user) {
        try {
          const active = await hasActiveSubscription();
          const upgrade = await shouldUpgrade();
          
          setHasSubscription(active);
          setNeedsUpgrade(upgrade);
        } catch (error) {
          console.error('Error checking subscription:', error);
        } finally {
          setSubscriptionChecked(true);
        }
      }
    }
    
    if (user && !loading) {
      checkSubscription();
    } else if (!loading) {
      setSubscriptionChecked(true);
    }
  }, [user, loading]);
  
  // Show loading state when authenticating or checking subscription
  if (loading || (user && !subscriptionChecked)) {
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
