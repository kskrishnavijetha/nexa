
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubscription, hasActiveSubscription } from '@/utils/payment';
import { toast } from 'sonner';
import CheckoutForm from './payment/CheckoutForm';
import SubscriptionStatus from './payment/SubscriptionStatus';
import PlanFeatures from './payment/PlanFeatures';

interface PaymentFormProps {
  onSuccess?: (paymentId: string) => void;
}

const PaymentForm = (props: PaymentFormProps) => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(getSubscription());
  const [isRenewal, setIsRenewal] = useState(false);

  useEffect(() => {
    // Check if user has a subscription but it's expired (renewal case)
    const currentSubscription = getSubscription();
    if (currentSubscription && !currentSubscription.active) {
      setIsRenewal(true);
    }
    setSubscription(currentSubscription);
  }, []);

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    toast.success('Subscription activated successfully!');
    
    // Update subscription state
    setSubscription(getSubscription());
    
    // Redirect to document analysis page after 2 seconds
    setTimeout(() => {
      navigate('/document-analysis');
    }, 2000);
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center mb-10">
          {isRenewal ? 'Renew Your Subscription' : (hasActiveSubscription() ? 'Manage Your Subscription' : 'Choose Your Plan')}
        </h2>
        <p className="text-muted-foreground">
          Select a subscription plan to start analyzing documents
        </p>
      </div>
      
      {subscription && (
        <SubscriptionStatus 
          subscription={subscription} 
          onRenew={() => setIsRenewal(true)} 
        />
      )}
      
      {(isRenewal || !hasActiveSubscription()) && (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <CheckoutForm 
              onSuccess={props.onSuccess || handlePaymentSuccess} 
            />
          </div>
          <div className="flex-1 bg-muted/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">What you get</h3>
            <PlanFeatures />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
