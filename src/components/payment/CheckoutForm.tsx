
import React, { useState, useEffect } from 'react';
import { getSubscription } from '@/utils/paymentService';
import PaymentTierSelector from './PaymentTierSelector';
import PaymentBillingToggle from './PaymentBillingToggle';
import PaymentButtons from './PaymentButtons';
import PaymentSummary from './PaymentSummary';
import { getPrice } from '@/utils/pricingData';

interface CheckoutFormProps {
  onSuccess?: (paymentId: string) => void;
  initialPlan?: string | null;
  initialBillingCycle?: 'monthly' | 'annually';
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  onSuccess = () => {},
  initialPlan, 
  initialBillingCycle 
}) => {
  const [selectedTier, setSelectedTier] = useState<string>(initialPlan || 'free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>(initialBillingCycle || 'monthly');
  const [loading, setLoading] = useState(false);
  const currentSubscription = getSubscription();
  
  // If initialPlan is provided or user has an existing subscription, preselect that tier
  useEffect(() => {
    if (initialPlan) {
      setSelectedTier(initialPlan);
    } else if (currentSubscription?.plan) {
      setSelectedTier(currentSubscription.plan);
    }
  }, [initialPlan, currentSubscription]);

  // Helper function to get price for the selected tier
  const getPriceForTier = (tier: string) => {
    return getPrice(tier, billingCycle);
  };

  const handleSuccess = (paymentId: string) => {
    // Create local subscription record
    import('@/utils/payment/subscriptionService').then(({ saveSubscription }) => {
      saveSubscription(selectedTier, paymentId, billingCycle);
      
      // Call the onSuccess callback
      if (onSuccess) {
        onSuccess(paymentId);
      }
    });
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
          onSelectTier={setSelectedTier}
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
          onSuccess={handleSuccess}
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
