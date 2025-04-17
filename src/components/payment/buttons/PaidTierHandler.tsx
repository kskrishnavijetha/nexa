
import React from 'react';
import { toast } from 'sonner';
import PayPalButton from './PayPalButton';

interface PaidTierHandlerProps {
  tier: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  billingCycle: 'monthly' | 'annually';
  onSuccess: (paymentId: string) => void;
  changePlan?: boolean;
  currentPlan?: string;
}

const PaidTierHandler: React.FC<PaidTierHandlerProps> = ({
  tier,
  loading,
  setLoading,
  billingCycle,
  onSuccess,
  changePlan,
  currentPlan
}) => {
  const handleError = (error: any) => {
    toast.error('There was an error processing your subscription. Please try again.');
    setLoading(false);
  };

  return (
    <PayPalButton
      tier={tier}
      billingCycle={billingCycle}
      onSuccess={onSuccess}
      onError={handleError}
      loading={loading}
      setLoading={setLoading}
    />
  );
};

export default PaidTierHandler;
