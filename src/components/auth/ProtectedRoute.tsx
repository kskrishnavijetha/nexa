
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { hasActiveSubscription, shouldUpgrade } from '@/utils/paymentService';
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
    
    // Only notify once when they need to upgrade and they're not already on the pricing page
    if (needsUpgrade && location.pathname !== '/pricing' && location.pathname !== '/payment') {
      toast.info('Your free plan has expired. Please upgrade to continue.', {
        action: {
          label: 'Upgrade',
          onClick: () => navigate('/pricing'),
        },
        duration: 5000,
      });
    }
  }, [navigate, location.pathname]);

  // User is authenticated, render the protected layout and outlet
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
