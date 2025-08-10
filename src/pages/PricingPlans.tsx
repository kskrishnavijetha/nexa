import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getSubscription, 
  saveSubscription, 
  hasActiveSubscription, 
  shouldUpgrade,
  isFreePlanCompleted 
} from '@/utils/paymentService';
import { pricingTiers, getPrice } from '@/utils/pricingData';
import PricingCard from '@/components/pricing/PricingCard';
import BillingToggle from '@/components/pricing/BillingToggle';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const PricingPlans: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    setCheckingSubscription(true);
    
    if (user) {
      console.log('PricingPlans - Checking user subscription...');
      const currentSubscription = getSubscription(user.id);
      const upgradeNeeded = shouldUpgrade(user.id);
      
      console.log('PricingPlans - User subscription check:', {
        currentSubscription,
        upgradeNeeded,
        userId: user.id
      });
      
      setSubscription(currentSubscription);
      setNeedsUpgrade(upgradeNeeded);
    } else if (!loading && !user) {
      console.log('PricingPlans - No user, showing guest pricing');
      setSubscription(null);
      setNeedsUpgrade(false);
    }
    
    setCheckingSubscription(false);
  }, [user, loading]);

  const handleFreePlanActivation = () => {
    if (!user) {
      toast.error('Please sign in to activate the free plan');
      navigate('/sign-in');
      return;
    }

    // Check if user already has a subscription
    const existingSubscription = getSubscription(user.id);
    if (existingSubscription) {
      toast.info('You already have an active subscription');
      navigate('/dashboard');
      return;
    }

    // Activate free plan
    try {
      const subscriptionId = 'free_' + Math.random().toString(36).substring(2, 15);
      const newSubscription = saveSubscription('free', subscriptionId, 'monthly', user.id);
      
      console.log('Free plan activated for user:', newSubscription);
      toast.success('Free plan activated! You now have 5 free document scans.');
      
      // Update local state and redirect to dashboard
      setSubscription(newSubscription);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error activating free plan:', error);
      toast.error('Failed to activate free plan. Please try again.');
    }
  };

  const getButtonText = (tier: string) => {
    if (tier === 'free') {
      if (!user) return 'Sign Up Free';
      if (subscription && subscription.plan === 'free') return 'Current Plan';
      if (isFreePlanCompleted(user.id)) return 'Plan Completed';
      return 'Activate Free Plan';
    }
    return 'Subscribe';
  };

  // Show free plan for all users, but handle activation differently
  const shouldShowFreePlan = true;
  const isFreePlanDisabled = user && subscription && isFreePlanCompleted(user.id);

  if (loading || checkingSubscription) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pricing plans...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 mb-8">
            Select the perfect plan for your compliance needs
          </p>
        </div>
        
        <BillingToggle />
        
        {user && !subscription && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700 font-medium">
              Welcome! Please activate your free plan to get started with 5 free document scans.
            </p>
          </div>
        )}

        {needsUpgrade && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-700">
              You've reached your plan limits. Please upgrade to continue using all features.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Show Free Plan for all users */}
        {shouldShowFreePlan && (
          <PricingCard
            title="Free"
            price={0}
            billingCycle="monthly"
            features={pricingTiers.free.features}
            scans={pricingTiers.free.scans}
            buttonText={getButtonText('free')}
            onSelect={handleFreePlanActivation}
            isPopular={false}
            isCurrentPlan={subscription?.plan === 'free'}
            disabled={isFreePlanDisabled}
          />
        )}

        {/* Other paid plans */}
        {Object.entries(pricingTiers)
          .filter(([key]) => key !== 'free')
          .map(([key, tier]) => (
            <PricingCard
              key={key}
              title={tier.name}
              price={getPrice(key, 'monthly')}
              billingCycle="monthly"
              features={tier.features}
              scans={tier.scans}
              buttonText={getButtonText(key)}
              onSelect={() => console.log(`Selected ${key} plan`)}
              isPopular={key === 'pro'}
              isCurrentPlan={subscription?.plan === key}
              disabled={false}
            />
          ))}
      </div>
    </Layout>
  );
};

export default PricingPlans;
