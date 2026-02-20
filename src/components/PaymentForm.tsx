import React from 'react';
import CheckoutForm from './payment/CheckoutForm';
import PaymentPageHeader from './payment/PaymentPageHeader';
import { useSubscription } from '@/hooks/useSubscription';

interface PaymentFormProps {
  onSuccess?: (paymentId: string) => void;
  initialPlan?: string | null;
  changePlan?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const { subscription } = useSubscription();
  const isRenewal = subscription && !subscription.active;
  const isNewSignup = !subscription;
  const isChangingPlan = props.changePlan || (subscription && subscription.active);

  return (
    <div className="max-w-md w-full mx-auto">
      <PaymentPageHeader
        isRenewal={isRenewal}
        isNewSignup={isNewSignup}
        isChangingPlan={isChangingPlan}
      />
      <CheckoutForm
        {...props}
        changePlan={isChangingPlan}
        currentPlan={subscription?.plan}
      />
    </div>
  );
};

export default PaymentForm;
