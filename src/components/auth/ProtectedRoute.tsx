
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { hasActiveSubscription, shouldUpgrade, getSubscription } from '@/utils/paymentService';
import { toast } from 'sonner';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
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
    return <Navigate to="/sign-in" replace />;
  }
  
  // Check if the user's subscription needs upgrading
  useEffect(() => {
    const needsUpgrade = shouldUpgrade();
    const subscription = getSubscription();
    
    // Only notify once when they need to upgrade and they're not already on the pricing page
    if (needsUpgrade && location.pathname !== '/pricing' && location.pathname !== '/payment') {
      // Display appropriate message based on the subscription plan
      const plan = subscription?.plan || 'free';
      const message = `Your ${plan} plan has expired. Please renew or upgrade to continue.`;
      
      toast.info(message, {
        action: {
          label: 'View Plans',
          onClick: () => navigate('/pricing'),
        },
        duration: 5000,
      });
      
      // Redirect to pricing if they're trying to access protected content with expired subscription
      navigate('/pricing');
      return;
    }
  }, [navigate, location.pathname]);

  // User is authenticated, but check for active subscription before allowing protected routes
  if (!hasActiveSubscription() && location.pathname !== '/pricing' && location.pathname !== '/payment') {
    // Just redirect to pricing instead of rendering the outlet
    return <Navigate to="/pricing" replace />;
  }

  // User is authenticated with active subscription, render the protected layout and outlet
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
