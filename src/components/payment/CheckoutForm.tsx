
import React, { useState, useEffect } from 'react';
import { getSubscription } from '@/utils/paymentService';
import PaymentTierSelector from './PaymentTierSelector';
import PaymentBillingToggle from './PaymentBillingToggle';
import PaymentButtons from './PaymentButtons';
import PaymentSummary from './PaymentSummary';
import { getPrice } from '@/utils/pricingData';
import { PlanName, isValidPlanName } from '@/utils/payment/planTypes';

interface CheckoutFormProps {
  onSuccess?: (paymentId: string) => void;  // Changed from required to optional with '?'
  initialPlan?: string | null;
  initialBillingCycle?: 'monthly' | 'annually';
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  onSuccess = () => {}, // Add a default empty function 
  initialPlan, 
  initialBillingCycle 
}) => {
  const [selectedTier, setSelectedTier] = useState<PlanName>('free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>(initialBillingCycle || 'monthly');
  const [loading, setLoading] = useState(false);
  const currentSubscription = getSubscription();
  
  // If initialPlan is provided or user has an existing subscription, preselect that tier
  useEffect(() => {
    if (initialPlan && isValidPlanName(initialPlan)) {
      setSelectedTier(initialPlan);
    } else if (currentSubscription?.plan && isValidPlanName(currentSubscription.plan)) {
      setSelectedTier(currentSubscription.plan);
    }
  }, [initialPlan, currentSubscription]);

  // Helper function to get price for the selected tier
  const getPriceForTier = (tier: string) => {
    return getPrice(tier, billingCycle);
  };

  // Handler that ensures type safety when selecting tiers
  const handleSelectTier = (tier: string) => {
    if (isValidPlanName(tier)) {
      setSelectedTier(tier);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select a Plan</h3>
        
        <PaymentBillingToggle 
          billingCycle={billingCycle}
          setBillingCycle={setBillingCycle}
        />
        
        <PaymentTierSelector
          selectedTier={selectedTier}
          billingCycle={billingCycle}
          onSelectTier={handleSelectTier}
          getPrice={getPriceForTier}
        />
      </div>

      <div className="rounded-md border p-4 bg-slate-50">
        <p className="text-sm text-muted-foreground mb-4">
          {selectedTier === 'free' 
            ? 'Activate your free plan to start analyzing documents'
            : 'Set up your subscription with PayPal for quick and secure payments.'
          }
        </p>
        <PaymentButtons 
          onSuccess={onSuccess}
          tier={selectedTier}
          loading={loading}
          setLoading={setLoading}
          billingCycle={billingCycle}
        />
      </div>

      <PaymentSummary 
        selectedTier={selectedTier}
        billingCycle={billingCycle}
        getPrice={getPriceForTier}
      />
    </div>
  );
};

export default CheckoutForm;
