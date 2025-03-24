
import React from 'react';
import CheckoutForm from './CheckoutForm';
import { getSubscription } from '@/utils/paymentService';

interface PaymentFormProps {
  onSuccess?: (paymentId: string) => void;
}

const PaymentForm = (props: PaymentFormProps) => {
  return (
    <div className="max-w-md w-full mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {getSubscription()?.active ? 'Change Your Plan' : 'Choose Your Plan'}
        </h2>
        <p className="text-muted-foreground">
          Select a subscription plan to start analyzing documents
        </p>
      </div>
      
      <CheckoutForm {...props} />
    </div>
  );
};

export default PaymentForm;
