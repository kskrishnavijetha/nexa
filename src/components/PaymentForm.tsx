
import React, { useState, useEffect } from 'react';
import { getSubscription } from '@/utils/paymentService';
import CheckoutForm from './payment/CheckoutForm';
import PaymentPageHeader from './payment/PaymentPageHeader';

interface PaymentFormProps {
  onSuccess?: (paymentId: string) => void;
  initialPlan?: string | null;
}

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRenewal, setIsRenewal] = useState<boolean>(false);
  const [isNewSignup, setIsNewSignup] = useState<boolean>(false);
  
  useEffect(() => {
    async function fetchSubscription() {
      try {
        const sub = await getSubscription();
        setSubscription(sub);
        setIsRenewal(!!sub && !sub.active);
        setIsNewSignup(!sub);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSubscription();
  }, []);
  
  return (
    <div className="max-w-md w-full mx-auto">
      <PaymentPageHeader isRenewal={isRenewal} isNewSignup={isNewSignup} />
      <CheckoutForm {...props} />
    </div>
  );
};

export default PaymentForm;
