import React, { useState, useEffect } from 'react';
import { getSubscription } from '@/utils/paymentService';
import PaymentTierSelector from './PaymentTierSelector';
import PaymentButtons from './PaymentButtons';
import PaymentSummary from './PaymentSummary';
import { getPrice } from '@/utils/pricingData';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';

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
  const [selectedTier, setSelectedTier] = useState<string>(initialPlan || 'free');
  const billingCycle = 'monthly';
  const [loading, setLoading] = useState(false);
  const { subscription } = useSubscription();
  const { user } = useAuth();

  useEffect(() => {
    if (initialPlan) {
      setSelectedTier(initialPlan);
    } else if (subscription?.plan) {
      if (changePlan) {
        setSelectedTier(subscription.plan);
      } else if (subscription.plan === 'free' && !subscription.active) {
        setSelectedTier('starter');
      }
    }
  }, [initialPlan, subscription, changePlan]);

  const handleSuccess = async (paymentId: string) => {
    const { saveSubscription } = await import('@/utils/payment/subscriptionService');
    await saveSubscription(selectedTier, paymentId, 'monthly', user?.id);
    toast.success(`Your ${selectedTier} plan is now active!`);
    if (onSuccess) onSuccess(paymentId);
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
              : 'Subscribe to continue with premium features'}
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
