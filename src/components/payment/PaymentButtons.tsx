
import React, { useState } from 'react';
import { toast } from 'sonner';
import { shouldUpgrade, saveSubscription } from '@/utils/paymentService';
import { useAuth } from '@/contexts/AuthContext';
import FreeButton from './buttons/FreeButton';
import PaidTierHandler from './buttons/PaidTierHandler';

interface PaymentButtonsProps {
  onSuccess?: (paymentId: string) => void;
  tier: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  billingCycle: 'monthly' | 'annually';
  changePlan?: boolean;
  currentPlan?: string;
}

const PaymentButtons: React.FC<PaymentButtonsProps> = ({
  onSuccess = () => {},
  tier,
  loading,
  setLoading,
  billingCycle,
  changePlan = false,
  currentPlan
}) => {
  const { user } = useAuth();

  const needsUpgrade = tier !== 'free' || (user && shouldUpgrade(user.id));
  const isChangingPlan = changePlan && tier !== currentPlan;
  
  const buttonText = isChangingPlan
    ? `Change to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`
    : tier === 'free' 
      ? 'Activate Free Plan'
      : `Subscribe to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`;

  const handleFreePlanActivation = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      console.log('PaymentButtons - Activating free plan for user:', user?.id);
      
      // Generate a subscription ID for the free plan
      const subscriptionId = 'free_' + Math.random().toString(36).substring(2, 15);
      
      // Save the subscription
      const subscription = saveSubscription(tier, subscriptionId, 'monthly', user?.id);
      console.log('PaymentButtons - Free subscription saved:', subscription);
      
      toast.success('Free plan activated successfully!');
      onSuccess(subscriptionId);
    } catch (error) {
      console.error('PaymentButtons - Error activating free plan:', error);
      toast.error('Failed to activate free plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (tier === 'starter' || tier === 'pro' || tier === 'enterprise') {
    return (
      <PaidTierHandler
        tier={tier}
        loading={loading}
        setLoading={setLoading}
        billingCycle={billingCycle}
        onSuccess={onSuccess}
        changePlan={changePlan}
        currentPlan={currentPlan}
      />
    );
  }
  
  return (
    <FreeButton
      loading={loading}
      needsUpgrade={false} // Always allow free plan activation
      onActivate={handleFreePlanActivation}
      buttonText={buttonText}
    />
  );
};

export default PaymentButtons;
