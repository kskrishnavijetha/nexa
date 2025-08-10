
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getSubscription, 
  saveSubscription, 
  hasActiveSubscription, 
  shouldUpgrade,
  isFreePlanCompleted 
} from '@/utils/paymentService';
import { freeFeatures, starterFeatures, proFeatures, enterpriseFeatures, pricing, formatPrice } from '@/components/pricing/PricingData';
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

  const handlePlanSelect = (tier: string) => {
    if (tier === 'free') {
      handleFreePlanActivation();
    } else {
      console.log(`Selected ${tier} plan`);
      // Handle paid plan selection
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Free Plan */}
          {shouldShowFreePlan && (
            <PricingCard
              title="Free"
              description="Perfect for getting started"
              price={formatPrice(pricing.free.monthly, 'monthly')}
              features={freeFeatures}
              isRecommended={false}
              onSelectPlan={() => handlePlanSelect('free')}
              buttonText={getButtonText('free')}
              buttonVariant={subscription?.plan === 'free' ? 'outline' : 'default'}
              disabled={isFreePlanDisabled}
            />
          )}

          {/* Starter Plan */}
          <PricingCard
            title="Starter"
            description="Ideal for small teams"
            price={formatPrice(pricing.starter.monthly, 'monthly')}
            features={starterFeatures}
            isRecommended={false}
            onSelectPlan={() => handlePlanSelect('starter')}
            buttonText={getButtonText('starter')}
            buttonVariant={subscription?.plan === 'starter' ? 'outline' : 'default'}
            disabled={false}
          />

          {/* Pro Plan */}
          <PricingCard
            title="Pro"
            description="Best for growing businesses"
            price={formatPrice(pricing.pro.monthly, 'monthly')}
            features={proFeatures}
            isRecommended={true}
            onSelectPlan={() => handlePlanSelect('pro')}
            buttonText={getButtonText('pro')}
            buttonVariant={subscription?.plan === 'pro' ? 'outline' : 'default'}
            disabled={false}
          />

          {/* Enterprise Plan */}
          <PricingCard
            title="Enterprise"
            description="For large organizations"
            price={formatPrice(pricing.enterprise.monthly, 'monthly')}
            features={enterpriseFeatures}
            isRecommended={false}
            onSelectPlan={() => handlePlanSelect('enterprise')}
            buttonText={getButtonText('enterprise')}
            buttonVariant={subscription?.plan === 'enterprise' ? 'outline' : 'default'}
            disabled={false}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PricingPlans;
