
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
}

const PaymentButtons: React.FC<PaymentButtonsProps> = ({
  onSuccess = () => {},
  tier,
  loading,
  setLoading,
  billingCycle
}) => {
  const { user } = useAuth();

  const needsUpgrade = tier !== 'free' || (user && shouldUpgrade(user.id));
  const buttonText = tier === 'free' 
    ? (needsUpgrade ? 'Select a Paid Plan' : 'Activate Free Plan')
    : `Subscribe to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`;

  const handleFreePlanActivation = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      if (tier === 'free' && needsUpgrade) {
        toast.info('Please select a paid plan to continue');
        setLoading(false);
        return;
      }
      
      const subscriptionId = tier + '_' + Math.random().toString(36).substring(2, 15);
      
      saveSubscription(tier, subscriptionId, 'monthly', user?.id);
      
      toast.success(`${tier.charAt(0).toUpperCase() + tier.slice(1)} plan activated!`);
      onSuccess(subscriptionId);
    } catch (error) {
      toast.error(`Failed to activate ${tier} plan. Please try again.`);
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
      />
    );
  }
  
  return (
    <FreeButton
      loading={loading}
      needsUpgrade={needsUpgrade}
      onActivate={handleFreePlanActivation}
      buttonText={buttonText}
    />
  );
};

export default PaymentButtons;
