
import React, { useEffect, useState } from 'react';
import PaymentForm from '@/components/PaymentForm';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { getSubscription, hasActiveSubscription } from '@/utils/paymentService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Payment = () => {
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

  // Feature lists for each tier
  const freeFeatures = [
    "1 compliance scan per month",
    "Basic GDPR compliance check",
    "Basic PDF report",
    "Community support"
  ];
  
  const basicFeatures = [
    "10 compliance scans per month",
    "Basic GDPR, HIPAA, and SOC2 compliance checks",
    "Downloadable PDF reports",
    "Email support"
  ];
  
  const proFeatures = [
    "50 compliance scans per month",
    "Advanced compliance analysis for all regulations",
    "Detailed risk analysis with severity ratings",
    "AI-powered recommendations",
    "Priority email support"
  ];
  
  const enterpriseFeatures = [
    "Unlimited compliance scans",
    "Comprehensive compliance analysis for all regulations",
    "Custom compliance templates",
    "Advanced AI-powered suggestions",
    "Dedicated account manager",
    "24/7 priority support"
  ];

  const renderSubscriptionStatus = () => {
    if (!subscription) return null;
    
    const expirationDate = new Date(subscription.expirationDate);
    const formattedDate = expirationDate.toLocaleDateString();
    
    return (
      <div className="bg-muted/30 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-medium mb-2">Your Current Subscription</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plan:</span>
            <span className="font-medium capitalize">{subscription.plan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className={`font-medium ${subscription.active ? 'text-green-600' : 'text-red-600'}`}>
              {subscription.active ? 'Active' : 'Expired'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Scans used:</span>
            <span>{subscription.scansUsed} of {subscription.scansLimit === 999 ? 'Unlimited' : subscription.scansLimit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expires on:</span>
            <span>{formattedDate}</span>
          </div>
        </div>
        
        {!subscription.active && (
          <div className="mt-4">
            <p className="text-amber-600 mb-2">Your subscription has expired. Please renew to continue using CompliZen.</p>
            <Button 
              onClick={() => setIsRenewal(true)} 
              className="w-full"
            >
              Renew Subscription
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">
          {isRenewal ? 'Renew Your Subscription' : (hasActiveSubscription() ? 'Manage Your Subscription' : 'Choose Your Subscription Plan')}
        </h1>
        
        {renderSubscriptionStatus()}
        
        {(isRenewal || !hasActiveSubscription()) && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <PaymentForm onSuccess={handlePaymentSuccess} />
            </div>
            <div className="flex-1 bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">What you get</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-primary mb-2">Free Plan</h4>
                  <ul className="space-y-2">
                    {freeFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary mb-2">Basic Plan - $29/month</h4>
                  <ul className="space-y-2">
                    {basicFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary mb-2">Pro Plan - $99/month</h4>
                  <ul className="space-y-2">
                    {proFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary mb-2">Enterprise Plan - $299/month</h4>
                  <ul className="space-y-2">
                    {enterpriseFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
