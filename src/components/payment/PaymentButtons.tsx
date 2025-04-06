
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { 
  loadPayPalScript,
  createPayPalButtons
} from '@/utils/payment/paypalService';
import { createSubscription } from '@/utils/payment/paymentProcessor';
import { toast } from 'sonner';

interface PaymentButtonsProps {
  onSuccess?: (paymentId: string) => void;
  tier: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  billingCycle: 'monthly' | 'annually';
}

const PaymentButtons: React.FC<PaymentButtonsProps> = ({
  onSuccess = () => {},
  tier,
  loading,
  setLoading,
  billingCycle
}) => {
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const [paypalInitialized, setPaypalInitialized] = useState(false);
  
  // Initialize PayPal when component mounts or when plan changes
  useEffect(() => {
    // For free tier, create a custom button instead of PayPal
    if (tier === 'free') {
      setPaypalInitialized(false);
      return;
    }
    
    // Load PayPal script
    const initializePayPal = async () => {
      if (paypalInitialized) return;
      
      setLoading(true);
      try {
        console.log('Loading PayPal script...');
        await loadPayPalScript();
        console.log('PayPal script loaded, creating buttons');
        
        if (!paypalContainerRef.current) {
          console.error('PayPal container not found');
          return;
        }
        
        // Create PayPal buttons
        createPayPalButtons(
          'paypal-button-container',
          tier,
          'monthly', // Always use monthly
          // On approve handler
          async (data) => {
            console.log('PayPal subscription approved', data);
            try {
              // Call your backend to verify and record the subscription
              const subscriptionId = data.subscriptionID || 'unknown';
              console.log('Creating subscription with ID:', subscriptionId);
              
              const result = await createSubscription('paypal_subscription', `price_${tier}_monthly`);
              if (result.success) {
                toast.success(`${tier.charAt(0).toUpperCase() + tier.slice(1)} plan activated!`);
                onSuccess(result.paymentId || subscriptionId);
              } else {
                toast.error(result.error || 'Payment failed. Please try again.');
              }
            } catch (error: any) {
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
        setPaypalInitialized(true);
      } catch (error) {
        console.error('Failed to load PayPal:', error);
        toast.error('Failed to load PayPal. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    initializePayPal();
    
    // Cleanup function
    return () => {
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = '';
        setPaypalInitialized(false);
      }
    };
  }, [tier, onSuccess, setLoading, paypalInitialized]);
  
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
    <div className="w-full">
      <div 
        id="paypal-button-container" 
        ref={paypalContainerRef}
        className="w-full min-h-[50px] bg-gray-50 rounded-md border border-gray-200 p-2"
      >
        {loading && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Loading PayPal...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentButtons;
