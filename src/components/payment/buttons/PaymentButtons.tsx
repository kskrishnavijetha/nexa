
import React, { useState } from 'react';
import { toast } from 'sonner';
import PayPalContainer from './PayPalContainer';
import FreePlanButton from './FreePlanButton';

interface PaymentButtonsProps {
  onSuccess?: (paymentId: string) => void;
  tier: string;
  billingCycle: 'monthly';
}

const PaymentButtons: React.FC<PaymentButtonsProps> = ({
  onSuccess = () => {},
  tier,
  billingCycle
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  
  const handlePayPalSuccess = (data: any) => {
    try {
      const subscriptionId = data.subscriptionID || 'paypal_sub_id';
      toast.success(`${tier.charAt(0).toUpperCase() + tier.slice(1)} plan activated!`);
      onSuccess(subscriptionId);
    } catch (error) {
      console.error('Subscription processing error:', error);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePayPalError = (error: any) => {
    console.error('PayPal error:', error);
    toast.error('PayPal payment failed. Please try again.');
    setLoading(false);
  };
  
  const handleFreePlanActivation = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      // For free tier, just create a local subscription record
      const subscriptionId = 'free_' + Math.random().toString(36).substring(2, 15);
      toast.success('Free plan activated!');
      onSuccess(subscriptionId);
    } catch (error) {
      toast.error('Failed to activate free plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (tier === 'free') {
    return <FreePlanButton onActivate={handleFreePlanActivation} loading={loading} />;
  }
  
  return (
    <PayPalContainer
      plan={tier}
      onSuccess={handlePayPalSuccess}
      onError={handlePayPalError}
      loading={loading}
      setLoading={setLoading}
    />
  );
};

export default PaymentButtons;
