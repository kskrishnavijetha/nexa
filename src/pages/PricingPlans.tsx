
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasActiveSubscription, getSubscription, shouldUpgrade, isFreePlanCompleted } from '@/utils/paymentService';
import BillingToggle from '@/components/pricing/BillingToggle';
import PricingCard from '@/components/pricing/PricingCard';
import { toast } from 'sonner';
import { 
  freeFeatures, 
  starterFeatures, 
  proFeatures, 
  enterpriseFeatures,
  pricing,
  formatPrice
} from '@/components/pricing/PricingData';
import { Loader2 } from 'lucide-react';

const PricingPlans = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  // Always use monthly billing now
  const billingCycle = 'monthly';
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    // Check subscription status when component mounts
    if (user && !loading) {
      setCheckingSubscription(false);
      
      // Check if user needs to upgrade using their user ID
      const currentSubscription = getSubscription(user.id);
      const upgradeNeeded = shouldUpgrade(user.id);
      
      setSubscription(currentSubscription);
      setNeedsUpgrade(upgradeNeeded);
    } else if (!loading && !user) {
      setCheckingSubscription(false);
    }
  }, [user, loading]);

  const handleSelectPlan = (plan: string) => {
    if (!user) {
      // Redirect non-logged in users to sign up
      navigate('/sign-up');
      toast.info('Please sign up to subscribe to a plan');
    } else {
      // For logged in users, redirect to payment with plan details
      navigate('/payment', { 
        state: { 
          selectedPlan: plan,
          billingCycle: billingCycle 
        }
      });
    }
  };

  const getButtonText = () => {
    if (!user) return 'Sign Up & Subscribe';
    
    if (hasActiveSubscription(user.id)) {
      return needsUpgrade ? 'Upgrade Plan' : 'Change Plan';
    }
    
    return 'Subscribe';
  };

  // Only show free plan if:
  // 1. User is not logged in (guest users)
  // 2. User has no subscription yet (new users should get free plan automatically on sign-in)
  // 3. User has completed free plan and needs to upgrade (show it as unavailable)
  const shouldShowFreePlan = !user || !subscription || (subscription && isFreePlanCompleted(user.id));
  const isFreePlanDisabled = user && subscription && isFreePlanCompleted(user.id);

  if (loading || checkingSubscription) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading pricing plans...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose the Right Plan for Your Compliance Needs</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Get started with our free plan or upgrade to premium features for comprehensive compliance coverage.
        </p>
        
        <BillingToggle />
        
        {user && !hasActiveSubscription(user.id) && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-amber-700">
              Please select a subscription plan to access all features
            </p>
          </div>
        )}
        
        {user && subscription && needsUpgrade && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-700 font-medium">
              {subscription.scansUsed >= subscription.scansLimit 
                ? `You've used all ${subscription.scansLimit} scans in your ${subscription.plan} plan.` 
                : `Your ${subscription.plan} plan has expired.`}
            </p>
            <p className="text-amber-700">
              Please select a new plan to continue using Nexabloom.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Show Free Plan for guests or completed free plan users (as unavailable) */}
        {shouldShowFreePlan && (
          <PricingCard
            title="Free"
            description={isFreePlanDisabled ? "Free plan completed - upgrade to continue" : "Get started with basic compliance checks"}
            price={formatPrice(pricing.free[billingCycle], billingCycle)}
            features={freeFeatures}
            buttonText={isFreePlanDisabled ? "Plan Completed" : getButtonText()}
            buttonVariant="outline"
            onSelectPlan={() => handleSelectPlan('free')}
            disabled={isFreePlanDisabled}
          />
        )}

        {/* Starter Plan */}
        <PricingCard
          title="Starter"
          description="Essential compliance tools for small businesses"
          price={formatPrice(pricing.starter[billingCycle], billingCycle)}
          features={starterFeatures}
          buttonText={getButtonText()}
          onSelectPlan={() => handleSelectPlan('starter')}
        />

        {/* Pro Plan - Highlighted as recommended */}
        <PricingCard
          title="Pro"
          description="Advanced compliance for growing organizations"
          price={formatPrice(pricing.pro[billingCycle], billingCycle)}
          features={proFeatures}
          isRecommended={true}
          buttonText={getButtonText()}
          onSelectPlan={() => handleSelectPlan('pro')}
        />

        {/* Enterprise Plan */}
        <PricingCard
          title="Enterprise"
          description="Complete compliance solution for large enterprises"
          price={formatPrice(pricing.enterprise[billingCycle], billingCycle)}
          features={enterpriseFeatures}
          buttonText={getButtonText()}
          onSelectPlan={() => handleSelectPlan('enterprise')}
        />
      </div>
    </div>
  );
};

export default PricingPlans;
