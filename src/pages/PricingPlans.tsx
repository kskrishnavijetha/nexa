import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
import { useSubscription } from '@/hooks/useSubscription';

const PricingPlans = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const billingCycle = 'monthly';
  const { subscription, loading: subLoading, needsUpgrade } = useSubscription();

  const handleSelectPlan = (plan: string) => {
    if (!user) {
      navigate('/sign-up');
      toast.info('Please sign up to subscribe to a plan');
    } else {
      navigate('/payment', { state: { selectedPlan: plan, billingCycle } });
    }
  };

  const getButtonText = () => {
    if (!user) return 'Sign Up & Subscribe';
    if (subscription?.active) return needsUpgrade ? 'Upgrade Plan' : 'Change Plan';
    return 'Subscribe';
  };

  const shouldShowFreePlan = !needsUpgrade || !subscription;

  if (loading || subLoading) {
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

        {user && !subscription?.active && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-amber-700">Please select a subscription plan to access all features</p>
          </div>
        )}

        {user && subscription && needsUpgrade && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-700 font-medium">
              {subscription.scansUsed >= subscription.scansLimit
                ? `You've used all ${subscription.scansLimit} scans in your ${subscription.plan} plan.`
                : `Your ${subscription.plan} plan has expired.`}
            </p>
            <p className="text-amber-700">Please select a new plan to continue using Nexabloom.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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

        <PricingCard
          title="Starter"
          description="Essential compliance tools for small businesses"
          price={formatPrice(pricing.starter[billingCycle], billingCycle)}
          features={starterFeatures}
          buttonText={getButtonText()}
          onSelectPlan={() => handleSelectPlan('starter')}
        />

        <PricingCard
          title="Pro"
          description="Advanced compliance for growing organizations"
          price={formatPrice(pricing.pro[billingCycle], billingCycle)}
          features={proFeatures}
          isRecommended={true}
          buttonText={getButtonText()}
          onSelectPlan={() => handleSelectPlan('pro')}
        />

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
