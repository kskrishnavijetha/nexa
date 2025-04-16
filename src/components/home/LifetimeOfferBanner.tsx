
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { processLifetimePaymentCompletion } from '@/utils/payment/paypal/lifetimeVerification';
import { toast } from 'sonner';
import { Loader2, Shield, Check } from 'lucide-react';

const LifetimeOfferBanner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Check if returning from PayPal payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const txnId = urlParams.get('txnId') || urlParams.get('txn_id');
    
    if (txnId) {
      // If we have a transaction ID, we're returning from PayPal
      setProcessingPayment(true);
      
      // Process the payment
      processLifetimePaymentCompletion(user?.id).then((result) => {
        if (result.success) {
          toast.success(result.message);
          // Redirect to dashboard after successful payment
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1500);
        } else {
          toast.error(result.message);
        }
        setProcessingPayment(false);
      });
    }
  }, [navigate, user]);

  const handlePaymentClick = () => {
    if (user) {
      // If user is logged in, redirect directly to PayPal payment link
      window.open('https://www.paypal.com/ncp/payment/YF2GNLBJ2YCEE', '_blank');
    } else {
      // If user is not logged in, redirect to sign in page first
      navigate('/sign-in', { state: { redirectAfterLogin: 'lifetime-payment' } });
    }
  };

  // Show processing state while handling payment
  if (processingPayment) {
    return (
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="animate-spin h-16 w-16 text-white mx-auto mb-4" />
          <h3 className="text-2xl font-bold">Processing Your Lifetime Purchase</h3>
          <p className="mt-2">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-yellow-300" />
                <h3 className="text-2xl font-bold">NexaBloom Lifetime Access — $999 One-Time</h3>
              </div>
              
              <p className="text-lg">
                Say goodbye to recurring fees. Pay once, stay compliant forever.
              </p>
              
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  🚀 What's Included:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span>Unlimited compliance scans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span>Extended audit-ready reports (PDF)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span>AI risk detection (GDPR, HIPAA, SOC 2, ISO)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span>Hash verification for tamper-proof reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span>Smart audit trails + predictive alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span>Slack/email alerts, all updates included</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="bg-yellow-400/20 rounded-lg px-4 py-2 inline-flex items-center">
                  <span className="font-bold">🔐 Only 50 lifetime licenses available.</span>
                </div>
                <div className="bg-yellow-400/20 rounded-lg px-4 py-2 inline-flex items-center">
                  <span className="font-bold">🎁 Includes all future Pro features — forever.</span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 w-full lg:w-auto lg:min-w-[240px] flex flex-col items-center">
              <div className="text-center mb-4">
                <div className="text-lg">One-time:</div>
                <div className="text-3xl font-bold">$999</div>
              </div>
              <Button 
                size="lg"
                onClick={handlePaymentClick}
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-8 py-6 text-lg shadow-lg w-full"
              >
                Claim Lifetime Access
              </Button>
              <p className="text-center text-sm mt-2 text-white/80">One-time payment. Forever access.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifetimeOfferBanner;
