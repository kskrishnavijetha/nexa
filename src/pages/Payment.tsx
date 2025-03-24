
import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createSubscription, getSubscription, hasActiveSubscription } from '@/utils/paymentService';

const Payment = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(getSubscription());
  const [isRenewal, setIsRenewal] = useState(false);

  useEffect(() => {
    // Check if user has a subscription but it's expired (renewal case)
    const currentSubscription = getSubscription();
    if (currentSubscription && !currentSubscription.active) {
      setIsRenewal(true);
      setSelectedPlan(currentSubscription.plan);
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

  const handleActivatePlan = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      // Process the subscription based on the selected plan
      const result = await createSubscription('mock_payment_method', `price_${selectedPlan}`);
      if (result.success) {
        toast.success(`${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan activated!`);
        handlePaymentSuccess(result.paymentId || 'unknown');
      } else {
        toast.error(result.error || 'Failed to activate plan. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to activate plan. Please try again.');
    } finally {
      setLoading(false);
    }
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

  // Pricing tiers definition
  const pricingTiers = [
    { 
      id: 'free', 
      name: 'Free', 
      scans: '1', 
      price: 'Free',
      perMonth: 'per month'
    },
    { 
      id: 'basic', 
      name: 'Basic', 
      scans: '10', 
      price: '$29/month',
      perMonth: 'per month'
    },
    { 
      id: 'pro', 
      name: 'Pro', 
      scans: '50', 
      price: '$99/month',
      perMonth: 'per month'
    },
    { 
      id: 'enterprise', 
      name: 'Enterprise', 
      scans: 'Unlimited', 
      price: '$299/month',
      perMonth: 'per month'
    }
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

  const renderFeatureList = (plan: string) => {
    let features;
    
    switch (plan) {
      case 'free':
        features = freeFeatures;
        break;
      case 'basic':
        features = basicFeatures;
        break;
      case 'pro':
        features = proFeatures;
        break;
      case 'enterprise':
        features = enterpriseFeatures;
        break;
      default:
        features = [];
    }
    
    return features.map((feature, index) => (
      <li key={index} className="flex items-start gap-2">
        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
          <Check className="h-3 w-3 text-primary" />
        </div>
        <span className="text-sm">{feature}</span>
      </li>
    ));
  };

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">
          Choose Your Subscription Plan
        </h1>
        
        {hasActiveSubscription() && renderSubscriptionStatus()}
        
        {(isRenewal || !hasActiveSubscription()) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
              <p className="text-muted-foreground mb-8">Select a subscription plan to start analyzing documents</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Select a Plan</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {pricingTiers.map((tier) => (
                    <div 
                      key={tier.id}
                      className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                        selectedPlan === tier.id 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-input hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPlan(tier.id)}
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">{tier.name}</div>
                        {selectedPlan === tier.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {tier.scans} scans
                        <br />
                        {tier.perMonth}
                      </div>
                      <div className="mt-2 font-semibold">
                        {tier.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-50 border rounded-md p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedPlan === 'free' 
                    ? 'Activate your free plan to start analyzing documents'
                    : 'Set up your subscription for quick and secure payments.'
                  }
                </p>
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={handleActivatePlan}
                >
                  {loading ? 'Processing...' : `Activate ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan`}
                </Button>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-8">What you get</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium text-primary mb-2">Free Plan</h3>
                  <ul className="space-y-2">
                    {renderFeatureList('free')}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-primary mb-2">Basic Plan - $29/month</h3>
                  <ul className="space-y-2">
                    {renderFeatureList('basic')}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-primary mb-2">Pro Plan - $99/month</h3>
                  <ul className="space-y-2">
                    {renderFeatureList('pro')}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-primary mb-2">Enterprise Plan - $299/month</h3>
                  <ul className="space-y-2">
                    {renderFeatureList('enterprise')}
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
