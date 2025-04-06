
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasActiveSubscription, getSubscription } from '@/utils/paymentService';
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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    // Check subscription status when component mounts
    if (!loading) {
      console.log('PricingPlans: User state loaded, auth status:', user ? 'Logged in' : 'Not logged in');
      
      // Force clear any cached subscription data to ensure fresh check
      if (user) {
        const subscription = getSubscription();
        const subscriptionActive = hasActiveSubscription();
        console.log('PricingPlans: User subscription status:', subscriptionActive ? 'Active' : 'Inactive');
        setHasSubscription(subscriptionActive);
        
        if (subscription) {
          console.log('PricingPlans: Current plan:', subscription.plan);
          setCurrentPlan(subscription.plan);
          
          // If user has active subscription (not free) and they're on pricing page, redirect to dashboard
          if (subscriptionActive && subscription.plan !== 'free') {
            console.log('PricingPlans: User has paid active subscription, redirecting to dashboard');
            navigate('/dashboard');
          }
        }
      }
      
      setCheckingSubscription(false);
    }
  }, [user, loading, navigate]);

  const handleSelectPlan = (plan: string) => {
    if (!user) {
      // Redirect non-logged in users to sign up
      console.log('PricingPlans: No user, redirecting to sign-up');
      navigate('/sign-up');
      toast.info('Please sign up to subscribe to a plan');
    } else {
      // For logged in users, redirect to payment with plan details
      console.log(`PricingPlans: User selected plan: ${plan} (${billingCycle})`);
      navigate('/payment', { 
        state: { 
          selectedPlan: plan,
          billingCycle: billingCycle 
        }
      });
    }
  };

  const getButtonText = (planType: string) => {
    if (!user) return 'Sign Up & Subscribe';
    
    if (currentPlan === planType) {
      return planType === 'free' ? 'Upgrade Now' : 'Current Plan';
    }
    
    return hasSubscription ? 'Change Plan' : 'Subscribe';
  };

  const shouldDisableButton = (planType: string) => {
    return currentPlan === planType && planType !== 'free';
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
        
        <BillingToggle 
          billingCycle={billingCycle} 
          onChange={setBillingCycle} 
        />
        
        {user && currentPlan === 'free' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-amber-700 font-medium">
              You are currently on the Free plan. Upgrade to access premium features like Document Analysis.
            </p>
          </div>
        )}
        
        {user && !hasSubscription && (
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
          buttonVariant={currentPlan === 'free' ? "default" : "outline"}
          onSelectPlan={() => handleSelectPlan('free')}
          disabled={false}
        />

        {/* Basic Plan */}
        <PricingCard
          title="Basic"
          description="Essential compliance tools for small businesses"
          price={formatPrice(pricing.basic[billingCycle], billingCycle)}
          features={basicFeatures}
          buttonText={getButtonText('basic')}
          onSelectPlan={() => handleSelectPlan('basic')}
          disabled={shouldDisableButton('basic')}
        />

        {/* Pro Plan - Highlighted as recommended */}
        <PricingCard
          title="Pro"
          description="Advanced compliance for growing organizations"
          price={formatPrice(pricing.pro[billingCycle], billingCycle)}
          features={proFeatures}
          isRecommended={true}
          buttonText={getButtonText('pro')}
          onSelectPlan={() => handleSelectPlan('pro')}
          disabled={shouldDisableButton('pro')}
        />

        {/* Enterprise Plan */}
        <PricingCard
          title="Enterprise"
          description="Complete compliance solution for large enterprises"
          price={formatPrice(pricing.enterprise[billingCycle], billingCycle)}
          features={enterpriseFeatures}
          buttonText={getButtonText('enterprise')}
          onSelectPlan={() => handleSelectPlan('enterprise')}
          disabled={shouldDisableButton('enterprise')}
        />
      </div>
    </div>
  );
};

export default PricingPlans;
