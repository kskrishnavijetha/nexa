
import React, { useState } from 'react';
import PayPalButtons from './paypal/PayPalButtons';
import FreeTierButton from './free/FreeTierButton';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { usePendingSubscription } from '@/hooks/usePendingSubscription';

interface PaymentButtonsProps {
  onSuccess?: (paymentId: string) => void;
  tier: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  billingCycle: 'monthly' | 'annually';
}

const PaymentButtons: React.FC<PaymentButtonsProps> = ({
  onSuccess = () => {},
  tier,
  loading,
  setLoading,
  billingCycle
}) => {
  const { needsUpgrade } = useSubscriptionStatus(tier);
  
  // Check for pending subscriptions
  usePendingSubscription(onSuccess);
  
  if (tier === 'basic' || tier === 'pro' || tier === 'enterprise') {
    return (
      <PayPalButtons
        tier={tier}
        billingCycle={billingCycle}
        loading={loading}
        setLoading={setLoading}
        onSuccess={onSuccess}
      />
    );
  }
  
  return (
    <FreeTierButton
      tier={tier}
      loading={loading}
      setLoading={setLoading}
      onSuccess={onSuccess}
      needsUpgrade={needsUpgrade}
      billingCycle={billingCycle}
    />
  );
};

export default PaymentButtons;
