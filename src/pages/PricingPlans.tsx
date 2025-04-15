
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasActiveSubscription, getSubscription, shouldUpgrade, SubscriptionInfo } from '@/utils/paymentService';
import BillingToggle from '@/components/pricing/BillingToggle';
import PricingCard from '@/components/pricing/PricingCard';
import { toast } from 'sonner';
import { 
  freeFeatures, 
  basicFeatures, 
  proFeatures, 
  enterpriseFeatures,
  pricing,
  formatPrice
} from '@/components/pricing/PricingData';
import { Loader2 } from 'lucide-react';

const PricingPlans = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  // Always use monthly billing now
  const billingCycle = 'monthly';
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [hasActiveSubscriptionState, setHasActiveSubscriptionState] = useState(false);

  useEffect(() => {
    // Check subscription status when component mounts
    async function checkSubscriptions() {
      if (user && !authLoading) {
        try {
          // Fetch subscription data in parallel
          const [active, upgradeNeeded, currentSubscription] = await Promise.all([
            hasActiveSubscription(),
            shouldUpgrade(),
            getSubscription()
          ]);
          
          setHasActiveSubscriptionState(active);
          setNeedsUpgrade(upgradeNeeded);
          setSubscription(currentSubscription);
        } catch (error) {
          console.error('Error checking subscription:', error);
        } finally {
          setCheckingSubscription(false);
        }
      } else if (!authLoading && !user) {
        setCheckingSubscription(false);
      }
    }
    
    checkSubscriptions();
  }, [user, authLoading]);

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
    
    if (hasActiveSubscriptionState) {
      return needsUpgrade ? 'Upgrade Plan' : 'Change Plan';
    }
    
    return 'Subscribe';
  };

  // Check if the free plan should be displayed
  const shouldShowFreePlan = !needsUpgrade || !subscription;

  if (authLoading || checkingSubscription) {
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
        
        {user && !hasActiveSubscriptionState && (
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
        {/* Only show Free Plan if not upgrading from an existing plan that's expired or depleted */}
        {shouldShowFreePlan && (
          <PricingCard
            title="Free"
            description="Get started with basic compliance checks"
            price={formatPrice(pricing.free[billingCycle], billingCycle)}
            features={freeFeatures}
            buttonText={getButtonText()}
            buttonVariant="outline"
            onSelectPlan={() => handleSelectPlan('free')}
            disabled={needsUpgrade}
          />
        )}

        {/* Basic Plan */}
        <PricingCard
          title="Basic"
          description="Essential compliance tools for small businesses"
          price={formatPrice(pricing.basic[billingCycle], billingCycle)}
          features={basicFeatures}
          buttonText={getButtonText()}
          onSelectPlan={() => handleSelectPlan('basic')}
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
