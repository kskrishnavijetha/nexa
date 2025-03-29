
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasActiveSubscription } from '@/utils/paymentService';
import BillingToggle from '@/components/pricing/BillingToggle';
import PricingCard from '@/components/pricing/PricingCard';
import { 
  freeFeatures, 
  basicFeatures, 
  proFeatures, 
  enterpriseFeatures,
  pricing,
  formatPrice
} from '@/components/pricing/PricingData';

const PricingPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const handleSelectPlan = (plan: string) => {
    if (!user) {
      navigate('/auth/signup');
    } else {
      navigate('/payment', { 
        state: { 
          selectedPlan: plan,
          billingCycle: billingCycle 
        }
      });
    }
  };

  const getButtonText = () => {
    return hasActiveSubscription() ? 'Change Plan' : 'Subscribe';
  };

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Free Plan */}
        <PricingCard
          title="Free"
          description="Get started with basic compliance checks"
          price={formatPrice(pricing.free[billingCycle], billingCycle)}
          features={freeFeatures}
          buttonText={hasActiveSubscription() ? 'Change Plan' : 'Get Started'}
          buttonVariant="outline"
          onSelectPlan={() => handleSelectPlan('free')}
        />

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
