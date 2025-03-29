
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentForm from '@/components/PaymentForm';
import { getSubscription, hasActiveSubscription } from '@/utils/paymentService';
import SubscriptionStatus from '@/components/payment/SubscriptionStatus';
import FeatureSummary from '@/components/payment/FeatureSummary';
import { toast } from 'sonner';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [subscription, setSubscription] = useState(getSubscription());
  const [isRenewal, setIsRenewal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  useEffect(() => {
    // Check if a plan was selected from the pricing page
    if (location.state?.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
    }
    
    // Check if billing cycle was selected
    if (location.state?.billingCycle) {
      setBillingCycle(location.state.billingCycle);
    }
    
    // Check if user has a subscription but it's expired (renewal case)
    const currentSubscription = getSubscription();
    if (currentSubscription && !currentSubscription.active) {
      setIsRenewal(true);
    }
    setSubscription(currentSubscription);
  }, [location.state]);

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

  const handleRenewClick = () => {
    setIsRenewal(true);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">
          {isRenewal ? 'Renew Your Subscription' : (hasActiveSubscription() ? 'Manage Your Subscription' : 'Choose Your Subscription Plan')}
        </h1>
        
        {subscription && (
          <SubscriptionStatus 
            subscription={subscription} 
            onRenew={handleRenewClick} 
          />
        )}
        
        {(isRenewal || !hasActiveSubscription()) && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <PaymentForm 
                onSuccess={handlePaymentSuccess} 
                initialPlan={selectedPlan} 
                initialBillingCycle={billingCycle}
              />
            </div>
            <div className="flex-1">
              <FeatureSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
