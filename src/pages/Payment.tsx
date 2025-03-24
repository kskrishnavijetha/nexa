
import React from 'react';
import PaymentForm from '@/components/PaymentForm';
import { useNavigate } from 'react-router-dom';
import PlansFeatureList from '@/components/payment/PlansFeatureList';

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

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">Choose Your Subscription Plan</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <PaymentForm onSuccess={handlePaymentSuccess} />
          </div>
          <PlansFeatureList 
            freeFeatures={freeFeatures}
            basicFeatures={basicFeatures}
            proFeatures={proFeatures}
            enterpriseFeatures={enterpriseFeatures}
          />
        </div>
      </div>
    </div>
  );
};

export default Payment;
