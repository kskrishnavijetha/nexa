
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentForm from '@/components/PaymentForm';
import { getSubscription, hasActiveSubscription } from '@/utils/payment/subscriptionService';
import SubscriptionStatus from '@/components/payment/SubscriptionStatus';
import FeatureSummary from '@/components/payment/FeatureSummary';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(getSubscription());
  const [isRenewal, setIsRenewal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user has an active subscription and redirected from another page
    if (hasActiveSubscription() && location.state?.fromProtectedRoute) {
      navigate('/dashboard');
    }
    
    // Check if a plan was selected from the pricing page
    if (location.state?.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
    }
    
    // Check if user has a subscription but it's expired (renewal case)
    const currentSubscription = getSubscription();
    if (currentSubscription && !currentSubscription.active) {
      setIsRenewal(true);
    }
    setSubscription(currentSubscription);
  }, [location.state, navigate]);

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    toast.success('Subscription activated successfully!');
    
    // Update subscription state
    setSubscription(getSubscription());
    
    // Redirect to dashboard page after 1.5 seconds
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleRenewClick = () => {
    setIsRenewal(true);
  };

  // If user is not authenticated, they shouldn't be on this page
  if (!user) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Please sign in to continue</h1>
        <p className="mb-4">You need to sign in to access subscription options.</p>
        <button 
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => navigate('/sign-in')}
        >
          Sign In
        </button>
      </div>
    );
  }

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
