
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { processLifetimePaymentCompletion } from '@/utils/payment/paypal/lifetimeVerification';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center">
                <span className="text-3xl mr-2">📝</span> 
                Limited Lifetime Offer
              </h3>
              
              <p className="text-lg mb-4">
                Get full access to NexaBloom's AI-powered compliance engine — smart scans, risk detection, 
                audit trails, alerts & PDF reports — for life.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start">
                  <span className="text-yellow-300 mr-2">💼</span>
                  <p>Only 30 founders & teams will get this one-time $999 deal. 
                  No subscriptions. No renewals. Just lifetime value.</p>
                </div>
                
                <div className="flex items-start">
                  <span className="text-yellow-300 mr-2">🎁</span>
                  <p>Save over $5,000+ vs annual plans.</p>
                </div>
                
                <div className="flex items-start">
                  <span className="text-yellow-300 mr-2">🔐</span>
                  <p>Perfect for startups, agencies & early-stage compliance teams.</p>
                </div>

                <div className="bg-yellow-400/20 rounded-lg px-4 py-2 flex items-center">
                  <div className="font-bold">
                    <span className="block">Limited offer!</span>
                    <span className="text-lg">Only 12 spots left</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Button 
                size="lg"
                onClick={handlePaymentClick}
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-8 py-6 text-lg shadow-lg"
              >
                Get Lifetime Access - $999
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
