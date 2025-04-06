
import React from 'react';
import { getSubscription } from '@/utils/paymentService';
import CheckoutForm from './payment/CheckoutForm';
import PaymentPageHeader from './payment/PaymentPageHeader';

interface PaymentFormProps {
  onSuccess?: (paymentId: string) => void;
  initialPlan?: string | null;
  initialBillingCycle?: 'monthly' | 'annually';
}

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const hasActiveSubscription = !!getSubscription()?.active;
  
  return (
    <div className="max-w-md w-full mx-auto">
      <PaymentPageHeader isRenewal={false} isNewSignup={!hasActiveSubscription} />
      <CheckoutForm {...props} />
    </div>
  );
};

export default PaymentForm;
