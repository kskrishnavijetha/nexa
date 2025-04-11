
import React, { useEffect } from 'react';
import FreePlanButton from './buttons/FreePlanButton';
import PayPalContainer from './buttons/PayPalContainer';
import { usePayPalState } from './buttons/usePayPalState';
import { saveSubscription } from '@/utils/paymentService';
import { toast } from 'sonner';

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
  // Use the custom hook for PayPal state management
  const {
    paypalError,
    setPaypalError,
    paypalButtonsRendered,
    setPaypalButtonsRendered,
    retryCount,
    setRetryCount,
    MAX_RETRIES
  } = usePayPalState(tier, billingCycle);
  
  // Handle PayPal approval
  const handlePayPalApprove = (data: any) => {
    console.log('PayPal subscription approved:', data);
    try {
      // Save the subscription locally
      const subscriptionId = data.subscriptionID || 'paypal_sub_id';
      // Create a subscription record
      saveSubscription(tier, subscriptionId, billingCycle);
      
      toast.success(`${tier.charAt(0).toUpperCase() + tier.slice(1)} plan activated!`);
      onSuccess(subscriptionId);
    } catch (error) {
      console.error('Subscription processing error:', error);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle PayPal error
  const handlePayPalError = (err: any) => {
    console.error('PayPal error:', err);
    setPaypalError('Failed to load PayPal. Please try again later.');
    toast.error('PayPal payment failed. Please try again.');
    setLoading(false);
  };
  
  // Initialize PayPal on component mount
  useEffect(() => {
    if (tier === 'free' || paypalButtonsRendered || loading) return;
    
    // Small delay to ensure container is ready
    const timer = setTimeout(() => {
      // PayPalContainer will handle initialization
      setPaypalButtonsRendered(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Display maximum retry attempts reached message
  useEffect(() => {
    if (retryCount >= MAX_RETRIES && paypalError) {
      toast.error("Maximum retry attempts reached. Please refresh the page and try again.");
    }
  }, [retryCount, paypalError, MAX_RETRIES]);
  
  // For free tier, use the FreePlanButton component
  if (tier === 'free') {
    return (
      <FreePlanButton
        onSuccess={onSuccess}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }
  
  // For paid plans, render the PayPal button container
  return (
    <PayPalContainer
      tier={tier}
      billingCycle={billingCycle}
      loading={loading}
      setLoading={setLoading}
      onApprove={handlePayPalApprove}
      onError={handlePayPalError}
      paypalError={paypalError}
      setPaypalError={setPaypalError}
      retryCount={retryCount}
      setRetryCount={setRetryCount}
      setPaypalButtonsRendered={setPaypalButtonsRendered}
    />
  );
};

export default PaymentButtons;
