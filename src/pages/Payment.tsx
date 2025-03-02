
import React from 'react';
import PaymentForm from '@/components/PaymentForm';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    // In a real app, you might want to redirect to a success page or dashboard
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  // Feature lists for each tier
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

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">Choose Your Subscription Plan</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <PaymentForm onSuccess={handlePaymentSuccess} />
          </div>
          <div className="flex-1 bg-muted/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">What you get</h3>
            
            <div className="space-y-6">
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
      </div>
    </div>
  );
};

export default Payment;
