
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { getSubscription, hasActiveSubscription } from '@/utils/paymentService';
import PaymentForm from '@/components/payment/PaymentForm';
import FeatureList from '@/components/payment/FeatureList';
import SubscriptionStatus from '@/components/payment/SubscriptionStatus';

const Payment = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(getSubscription());
  const [isRenewal, setIsRenewal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    // Check if user has a subscription but it's expired (renewal case)
    const currentSubscription = getSubscription();
    if (currentSubscription && !currentSubscription.active) {
      setIsRenewal(true);
    }
    
    // Check if user has free plan and has used up scans (upgrade case)
    if (currentSubscription && currentSubscription.active && 
        currentSubscription.plan === 'free' && 
        currentSubscription.scansUsed >= currentSubscription.scansLimit) {
      setIsUpgrading(true);
      toast.info("You've used all your free scans. Consider upgrading to a paid plan for more features.");
    }
    
    setSubscription(currentSubscription);
  }, []);

  useEffect(() => {
    // If user isn't signed in and auth is loaded, show notification
    if (isLoaded && !isSignedIn) {
      toast.error("Please sign in to access subscription plans");
    }
  }, [isLoaded, isSignedIn]);

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
    <div className="container mx-auto py-12">
      <SignedIn>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-10">
            {isRenewal ? 'Renew Your Subscription' : 
             isUpgrading ? 'Upgrade Your Plan' :
             (hasActiveSubscription() ? 'Manage Your Subscription' : 'Choose Your Subscription Plan')}
          </h1>
          
          {subscription && (
            <SubscriptionStatus 
              subscription={subscription}
              setIsRenewal={setIsRenewal}
              setIsUpgrading={setIsUpgrading}
              isUpgrading={isUpgrading}
            />
          )}
          
          {(isRenewal || isUpgrading || !hasActiveSubscription()) && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <PaymentForm onSuccess={handlePaymentSuccess} />
              </div>
              <div className="flex-1 bg-muted/30 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">What you get</h3>
                <FeatureList />
              </div>
            </div>
          )}
        </div>
      </SignedIn>
      <SignedOut>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-6">Sign In Required</h1>
          <p className="text-lg mb-8">Please sign in to access subscription plans</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/sign-in')}>Sign In</Button>
            <Button variant="outline" onClick={() => navigate('/sign-up')}>Create Account</Button>
          </div>
        </div>
      </SignedOut>
    </div>
  );
};

export default Payment;
