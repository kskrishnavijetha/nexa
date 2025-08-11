
import React, { useState, useEffect } from 'react';
import { getSubscription } from '@/utils/paymentService';
import PaymentTierSelector from './PaymentTierSelector';
import PaymentButtons from './PaymentButtons';
import PaymentSummary from './PaymentSummary';
import { getPrice } from '@/utils/pricingData';
import { toast } from 'sonner';

interface CheckoutFormProps {
  onSuccess?: (paymentId: string) => void;
  initialPlan?: string | null;
  initialBillingCycle?: 'monthly' | 'annually';
  changePlan?: boolean;
  currentPlan?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  onSuccess = () => {},
  initialPlan, 
  initialBillingCycle,
  changePlan = false,
  currentPlan
}) => {
  // Always respect the initialPlan if provided, otherwise default to free for new users
  const [selectedTier, setSelectedTier] = useState<string>(initialPlan || 'free');
  // Always use monthly billing now
  const billingCycle = 'monthly';
  const [loading, setLoading] = useState(false);
  const currentSubscription = getSubscription();
  
  // If initialPlan is provided, always use it and don't override
  useEffect(() => {
    if (initialPlan) {
      setSelectedTier(initialPlan);
    } else if (currentSubscription?.plan && changePlan) {
      // Only override for plan changes if no initial plan is specified
      setSelectedTier(currentSubscription.plan);
    }
    // Don't auto-suggest starter plan for new users - let them choose
  }, [initialPlan, currentSubscription, changePlan]);

  const handleSuccess = (paymentId: string) => {
    console.log("Handling subscription success:", paymentId, "for tier:", selectedTier);
    
    // Create local subscription record
    import('@/utils/payment/subscriptionService').then(({ saveSubscription }) => {
      const subscription = saveSubscription(selectedTier, paymentId, 'monthly');
      console.log("Subscription saved:", subscription);
      
      toast.success(`Your ${selectedTier} plan is now active!`);
      
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
        
        <PaymentTierSelector
          selectedTier={selectedTier}
          billingCycle={billingCycle}
          onSelectTier={setSelectedTier}
          initialTier={initialPlan}
          changePlan={changePlan}
          currentPlan={currentPlan}
        />
      </div>

      {selectedTier !== currentPlan && (
        <div className="rounded-md border p-4 bg-slate-50">
          <p className="text-sm text-muted-foreground mb-4">
            {selectedTier === 'free' 
              ? 'Activate your free plan to start analyzing documents'
              : changePlan 
                ? 'Subscribe to change your plan to ' + selectedTier
                : 'Subscribe to continue with premium features'
            }
          </p>
          <PaymentButtons 
            onSuccess={handleSuccess}
            tier={selectedTier}
            loading={loading}
            setLoading={setLoading}
            billingCycle={billingCycle}
            changePlan={changePlan}
            currentPlan={currentPlan}
          />
        </div>
      )}

      <PaymentSummary 
        selectedTier={selectedTier}
        billingCycle={billingCycle}
        getPrice={getPrice}
        changePlan={changePlan}
        currentPlan={currentPlan}
      />
    </div>
  );
};

export default CheckoutForm;
