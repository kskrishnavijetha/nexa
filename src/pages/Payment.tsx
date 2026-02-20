import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import PaymentForm from '@/components/PaymentForm';
import SubscriptionStatus from '@/components/payment/SubscriptionStatus';
import FeatureSummary from '@/components/payment/FeatureSummary';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processLifetimePaymentCompletion } from '@/utils/payment/paypal/lifetimeVerification';
import { useSubscription } from '@/hooks/useSubscription';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { subscription, loading: subLoading, refresh, needsUpgrade } = useSubscription();
  const [isRenewal, setIsRenewal] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const subscriptionId = searchParams.get('subscription_id');
    const paypalPaymentId = searchParams.get('paymentId');
    const txnId = searchParams.get('txnId') || searchParams.get('txn_id');

    if (token || subscriptionId || paypalPaymentId) {
      const pendingSubscription = localStorage.getItem('pendingSubscription');
      if (pendingSubscription) {
        try {
          const subData = JSON.parse(pendingSubscription);
          setSelectedPlan(subData.plan);
          localStorage.removeItem('pendingSubscription');
          toast.success('Payment processed successfully! Activating your subscription...');
        } catch (err) {
          console.error('Error processing pending subscription:', err);
        }
      }
    } else if (txnId) {
      setProcessingPayment(true);
      processLifetimePaymentCompletion(user?.id).then(async (result) => {
        if (result.success) {
          toast.success(result.message);
          await refresh();
        } else {
          toast.error(result.message);
        }
        setProcessingPayment(false);
      });
    }

    if (location.state?.selectedPlan) setSelectedPlan(location.state.selectedPlan);
    if (location.state?.changePlan) setIsChangingPlan(true);
  }, [location.state, searchParams, user]);

  useEffect(() => {
    if (subscription && !subscription.active) setIsRenewal(true);
  }, [subscription]);

  const handlePaymentSuccess = async (paymentId: string) => {
    setProcessingPayment(true);
    await refresh();
    toast.success('Subscription activated successfully!');
    setTimeout(() => {
      navigate('/dashboard');
      setProcessingPayment(false);
    }, 1500);
  };

  const handleRenewClick = () => { setIsRenewal(true); setIsChangingPlan(false); };
  const handleChangePlanClick = () => { setIsChangingPlan(true); setIsRenewal(false); };

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

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in to continue</h1>
          <p className="mb-4">You need to sign in to access subscription options.</p>
          <button className="bg-primary text-white px-4 py-2 rounded" onClick={() => navigate('/sign-in')}>
            Sign In
          </button>
        </div>
      </Layout>
    );
  }

  const hasLifetimePlan = subscription?.isLifetime || subscription?.billingCycle === 'lifetime';
  const hasActiveSub = !!subscription?.active;

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-10">
            {isChangingPlan ? 'Change Your Subscription Plan' :
              (isRenewal ? 'Renew Your Subscription' :
                (hasActiveSub ? 'Manage Your Subscription' : 'Choose Your Subscription Plan'))}
          </h1>

          {subscription && (
            <SubscriptionStatus
              subscription={subscription}
              onRenew={handleRenewClick}
              onChangePlan={handleChangePlanClick}
            />
          )}

          {hasLifetimePlan ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-6 text-center">
              <h2 className="text-2xl font-semibold text-emerald-700 mb-2">You Have Lifetime Access!</h2>
              <p className="text-emerald-600 mb-4">
                You've already purchased our lifetime plan, giving you unlimited access to all features forever.
              </p>
              <Button variant="default" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
          ) : (
            (isRenewal || isChangingPlan || !hasActiveSub) && (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <PaymentForm onSuccess={handlePaymentSuccess} initialPlan={selectedPlan} changePlan={isChangingPlan} />
                </div>
                <div className="flex-1"><FeatureSummary /></div>
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
