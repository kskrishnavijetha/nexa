
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasActiveSubscription, getSubscription, shouldUpgrade } from '@/utils/paymentService';
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
  const { user, loading } = useAuth();
  // Always use monthly billing now
  const billingCycle = 'monthly';
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [expiredPlan, setExpiredPlan] = useState<string | null>(null);

  useEffect(() => {
    // Check subscription status when component mounts
    if (user && !loading) {
      const subscription = getSubscription();
      setCurrentPlan(subscription?.plan || null);
      
      const upgrade = shouldUpgrade();
      setNeedsUpgrade(upgrade);
      
      // If subscription exists but needs upgrade, it means it has expired
      if (subscription && upgrade) {
        setExpiredPlan(subscription.plan);
        toast.warning(`Your ${subscription.plan} plan has expired. Please renew or select a new plan.`);
      }
      
      setCheckingSubscription(false);
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

  const getButtonText = (plan: string) => {
    if (!user) return 'Sign Up & Subscribe';
    if (expiredPlan === plan) return 'Renew Plan';
    if (currentPlan === plan && !needsUpgrade) return 'Current Plan';
    return hasActiveSubscription() ? 'Change Plan' : 'Subscribe';
  };

  const isCurrentPlan = (plan: string) => {
    return currentPlan === plan && !needsUpgrade;
  };

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
        
        {user && needsUpgrade && expiredPlan && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-amber-700 font-medium">
              Your {expiredPlan} plan has expired. Please renew or select a new plan to continue using all features.
            </p>
          </div>
        )}
        
        {user && !hasActiveSubscription() && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-amber-700">
              Please select a subscription plan to access all features
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Free Plan */}
        <PricingCard
          title="Free"
          description="Get started with basic compliance checks"
          price={formatPrice(pricing.free[billingCycle], billingCycle)}
          features={freeFeatures}
          buttonText={getButtonText('free')}
          buttonVariant={isCurrentPlan('free') ? "secondary" : "outline"}
          buttonDisabled={isCurrentPlan('free')}
          highlighted={expiredPlan === 'free'}
          onSelectPlan={() => handleSelectPlan('free')}
        />

        {/* Basic Plan */}
        <PricingCard
          title="Basic"
          description="Essential compliance tools for small businesses"
          price={formatPrice(pricing.basic[billingCycle], billingCycle)}
          features={basicFeatures}
          buttonText={getButtonText('basic')}
          buttonDisabled={isCurrentPlan('basic')}
          buttonVariant={isCurrentPlan('basic') ? "secondary" : "default"}
          highlighted={expiredPlan === 'basic'}
          onSelectPlan={() => handleSelectPlan('basic')}
        />

        {/* Pro Plan - Highlighted as recommended */}
        <PricingCard
          title="Pro"
          description="Advanced compliance for growing organizations"
          price={formatPrice(pricing.pro[billingCycle], billingCycle)}
          features={proFeatures}
          isRecommended={!needsUpgrade || currentPlan !== 'free'}
          buttonText={getButtonText('pro')}
          buttonDisabled={isCurrentPlan('pro')}
          buttonVariant={isCurrentPlan('pro') ? "secondary" : "default"}
          highlighted={expiredPlan === 'pro'}
          onSelectPlan={() => handleSelectPlan('pro')}
        />

        {/* Enterprise Plan */}
        <PricingCard
          title="Enterprise"
          description="Complete compliance solution for large enterprises"
          price={formatPrice(pricing.enterprise[billingCycle], billingCycle)}
          features={enterpriseFeatures}
          buttonText={getButtonText('enterprise')}
          buttonDisabled={isCurrentPlan('enterprise')}
          buttonVariant={isCurrentPlan('enterprise') ? "secondary" : "default"}
          highlighted={expiredPlan === 'enterprise'}
          onSelectPlan={() => handleSelectPlan('enterprise')}
        />
      </div>
    </div>
  );
};

export default PricingPlans;
