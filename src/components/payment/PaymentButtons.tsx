
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { 
  loadPayPalScript,
  createPayPalButtons,
  createSubscription
} from '@/utils/paymentService';
import { toast } from 'sonner';
import { PlanName } from '@/utils/payment/planTypes';

interface PaymentButtonsProps {
  onSuccess?: (paymentId: string) => void;  // Changed to optional
  tier: PlanName;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  billingCycle: 'monthly' | 'annually';
}

const PaymentButtons: React.FC<PaymentButtonsProps> = ({
  onSuccess = () => {},  // Added default empty function
  tier,
  loading,
  setLoading,
  billingCycle
}) => {
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // For free tier, create a custom button instead of PayPal
    if (tier === 'free') {
      return;
    }
    
    // Load PayPal script
    const initializePayPal = async () => {
      try {
        await loadPayPalScript();
        
        // Create PayPal buttons
        createPayPalButtons(
          'paypal-button-container',
          tier,
          billingCycle,
          // On approve handler
          async (data) => {
            setLoading(true);
            try {
              // Call your backend to verify and record the subscription
              const result = await createSubscription('paypal_subscription', `price_${tier}_${billingCycle}`);
              if (result.success) {
                toast.success(`${tier.charAt(0).toUpperCase() + tier.slice(1)} plan activated!`);
                onSuccess(result.paymentId || data.subscriptionID || 'unknown');
              } else {
                toast.error(result.error || 'Payment failed. Please try again.');
              }
            } catch (error) {
              toast.error('Failed to process subscription. Please try again.');
              console.error('Subscription error:', error);
            } finally {
              setLoading(false);
            }
          },
          // On error handler
          (err) => {
            console.error('PayPal error:', err);
            toast.error('PayPal payment failed. Please try again.');
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Failed to load PayPal:', error);
        toast.error('Failed to load PayPal. Please try again later.');
      }
    };
    
    if (!loading) {
      initializePayPal();
    }
    
    // Cleanup function
    return () => {
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = '';
      }
    };
  }, [tier, onSuccess, loading, setLoading, billingCycle]);
  
  // For free tier, use a regular button
  if (tier === 'free') {
    return (
      <Button 
        className="w-full"
        disabled={loading}
        onClick={async () => {
          if (loading) return;
          setLoading(true);
          
          try {
            const result = await createSubscription('mock_payment_method', `price_${tier}`);
            if (result.success) {
              toast.success('Free plan activated!');
              onSuccess(result.paymentId || 'unknown');
            } else {
              toast.error(result.error || 'Failed to activate free plan. Please try again.');
            }
          } catch (error) {
            toast.error('Failed to activate free plan. Please try again.');
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {loading ? 'Processing...' : 'Activate Free Plan'}
      </Button>
    );
  }
  
  // For paid plans, render the PayPal button container
  return (
    <div 
      id="paypal-button-container" 
      ref={paypalContainerRef}
      className="w-full min-h-[40px]"
    >
      {loading && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Loading PayPal...</span>
        </div>
      )}
    </div>
  );
};

export default PaymentButtons;
