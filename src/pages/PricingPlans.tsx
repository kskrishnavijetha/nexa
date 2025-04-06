
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasActiveSubscription } from '@/utils/paymentService';
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
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const billingCycle = 'monthly'; // Fixed to monthly

  useEffect(() => {
    // Check subscription status when component mounts
    if (user && !loading) {
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

  const getButtonText = () => {
    if (!user) return 'Sign Up & Subscribe';
    return hasActiveSubscription() ? 'Change Plan' : 'Subscribe';
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
          price={formatPrice(pricing.free.monthly, 'monthly')}
          features={freeFeatures}
          buttonText={getButtonText()}
          buttonVariant="outline"
          onSelectPlan={() => handleSelectPlan('free')}
        />

        {/* Basic Plan */}
        <PricingCard
          title="Basic"
          description="Essential compliance tools for small businesses"
          price={formatPrice(pricing.basic.monthly, 'monthly')}
          features={basicFeatures}
          buttonText={getButtonText()}
          onSelectPlan={() => handleSelectPlan('basic')}
        />

        {/* Pro Plan - Highlighted as recommended */}
        <PricingCard
          title="Pro"
          description="Advanced compliance for growing organizations"
          price={formatPrice(pricing.pro.monthly, 'monthly')}
          features={proFeatures}
          isRecommended={true}
          buttonText={getButtonText()}
          onSelectPlan={() => handleSelectPlan('pro')}
        />

        {/* Enterprise Plan */}
        <PricingCard
          title="Enterprise"
          description="Complete compliance solution for large enterprises"
          price={formatPrice(pricing.enterprise.monthly, 'monthly')}
          features={enterpriseFeatures}
          buttonText={getButtonText()}
          onSelectPlan={() => handleSelectPlan('enterprise')}
        />
      </div>
    </div>
  );
};

export default PricingPlans;
