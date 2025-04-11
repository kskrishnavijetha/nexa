
import React from 'react';
import { getSubscription } from '@/utils/payment/subscriptionService';
import CheckoutForm from './payment/CheckoutForm';
import PaymentPageHeader from './payment/PaymentPageHeader';

interface PaymentFormProps {
  onSuccess?: (paymentId: string) => void;
  initialPlan?: string | null;
}

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const subscription = getSubscription();
  const isRenewal = subscription && !subscription.active;
  const isNewSignup = !subscription;
  
  return (
    <div className="max-w-md w-full mx-auto">
      <PaymentPageHeader isRenewal={isRenewal} isNewSignup={isNewSignup} />
      <CheckoutForm {...props} />
    </div>
  );
};

export default PaymentForm;
