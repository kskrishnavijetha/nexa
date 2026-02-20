import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useSubscription } from '@/hooks/useSubscription';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { subscription, loading: subLoading, needsUpgrade } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Pricing page always accessible
  if (location.pathname === '/pricing') {
    return <Layout><Outlet /></Layout>;
  }

  // Paths that require active subscription / remaining scans
  const strictSubscriptionPaths = [
    '/document-analysis/new',
    '/google-services/new-scan',
    '/slack-monitoring/new-scan',
  ];
  const isStrictPath = strictSubscriptionPaths.some(p => location.pathname.includes(p));

  if (isStrictPath && !subLoading) {
    const hasSubscription = !!subscription?.active;
    const hasScans = subscription
      ? subscription.isLifetime || subscription.scansUsed < subscription.scansLimit
      : false;

    if (!hasSubscription || needsUpgrade || !hasScans) {
      return <Navigate to="/pricing" replace />;
    }
  }

  return <Layout><Outlet /></Layout>;
};

export default ProtectedRoute;
