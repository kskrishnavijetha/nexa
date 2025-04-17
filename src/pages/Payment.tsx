
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import PaymentForm from '@/components/PaymentForm';
import { getSubscription, hasActiveSubscription } from '@/utils/paymentService';
import SubscriptionStatus from '@/components/payment/SubscriptionStatus';
import FeatureSummary from '@/components/payment/FeatureSummary';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processLifetimePaymentCompletion } from '@/utils/payment/paypal/lifetimeVerification';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(user ? getSubscription(user.id) : null);
  const [isRenewal, setIsRenewal] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  useEffect(() => {
    // Update subscription when user changes
    if (user) {
      setSubscription(getSubscription(user.id));
    }
  }, [user]);

  useEffect(() => {
    // Check if returning from PayPal subscription
    const token = searchParams.get('token');
    const subscriptionId = searchParams.get('subscription_id');
    const paypalPaymentId = searchParams.get('paymentId');
    const txnId = searchParams.get('txnId') || searchParams.get('txn_id');
    
    if (token || subscriptionId || paypalPaymentId) {
      console.log('Detected return from PayPal payment', { token, subscriptionId, paypalPaymentId });
      
      // Check for pending subscription in local storage
      const pendingSubscription = localStorage.getItem('pendingSubscription');
      if (pendingSubscription) {
        try {
          // Process the stored data
          const subData = JSON.parse(pendingSubscription);
          setSelectedPlan(subData.plan);
          
          // Clear the storage item after retrieving the data
          localStorage.removeItem('pendingSubscription');
          
          toast.success('Payment processed successfully! Activating your subscription...');
        } catch (err) {
          console.error('Error processing pending subscription:', err);
        }
      }
    } else if (txnId) {
      // Process lifetime payment completion
      setProcessingPayment(true);
      processLifetimePaymentCompletion(user?.id).then((result) => {
        if (result.success) {
          toast.success(result.message);
          // Update subscription state
          if (user) {
            setSubscription(getSubscription(user.id));
          }
        } else {
          toast.error(result.message);
        }
        setProcessingPayment(false);
      });
    }
    
    // Check if user has an active subscription and redirected from another page
    if (user && hasActiveSubscription(user.id) && location.state?.fromProtectedRoute && !location.state?.changePlan) {
      navigate('/dashboard');
    }
    
    // Check if a plan was selected from the pricing page
    if (location.state?.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
    }
    
    // Check if user wants to change the plan
    if (location.state?.changePlan) {
      setIsChangingPlan(true);
    }
    
    // Check if user has a subscription but it's expired (renewal case)
    if (user) {
      const currentSubscription = getSubscription(user.id);
      if (currentSubscription && !currentSubscription.active) {
        setIsRenewal(true);
      }
      setSubscription(currentSubscription);
    }
  }, [location.state, navigate, searchParams, user]);

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    setProcessingPayment(true);
    
    // Update subscription state
    if (user) {
      setSubscription(getSubscription(user.id));
    }
    
    toast.success('Subscription activated successfully!');
    
    // Redirect to dashboard page after 1.5 seconds
    setTimeout(() => {
      navigate('/dashboard');
      setProcessingPayment(false);
    }, 1500);
  };

  const handleRenewClick = () => {
    setIsRenewal(true);
    setIsChangingPlan(false);
  };

  const handleChangePlanClick = () => {
    setIsChangingPlan(true);
    setIsRenewal(false);
  };

  // If processing a payment, show loading state
  if (processingPayment) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <Loader2 className="animate-spin h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Processing Your Payment</h1>
          <p className="text-muted-foreground mt-2">Please wait while we verify your payment...</p>
        </div>
      </Layout>
    );
  }

  // If user is not authenticated, they shouldn't be on this page
  if (!user) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  // Check if user already has a lifetime subscription
  const hasLifetimePlan = subscription?.isLifetime || subscription?.billingCycle === 'lifetime';

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-10">
            {isChangingPlan ? 'Change Your Subscription Plan' : 
              (isRenewal ? 'Renew Your Subscription' : 
                (hasActiveSubscription(user.id) ? 'Manage Your Subscription' : 'Choose Your Subscription Plan'))}
          </h1>
          
          {subscription && (
            <SubscriptionStatus 
              subscription={subscription} 
              onRenew={handleRenewClick} 
              onChangePlan={handleChangePlanClick}
            />
          )}
          
          {/* Don't show payment form if user has a lifetime plan */}
          {hasLifetimePlan ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-6 text-center">
              <h2 className="text-2xl font-semibold text-emerald-700 mb-2">You Have Lifetime Access!</h2>
              <p className="text-emerald-600 mb-4">
                You've already purchased our lifetime plan, giving you unlimited access to all features forever.
              </p>
              <Button 
                variant="default"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            (isRenewal || isChangingPlan || !hasActiveSubscription(user.id)) && (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <PaymentForm 
                    onSuccess={handlePaymentSuccess} 
                    initialPlan={selectedPlan}
                    changePlan={isChangingPlan}
                  />
                </div>
                <div className="flex-1">
                  <FeatureSummary />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
