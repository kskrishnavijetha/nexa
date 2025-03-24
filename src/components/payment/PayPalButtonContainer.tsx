
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loadPayPalScript, createPayPalButtons, createSubscription } from '@/utils/paymentService';
import { pricingTiers } from './PricingTiers';

interface PayPalButtonContainerProps {
  onSuccess: (paymentId: string) => void;
  tier: keyof typeof pricingTiers;
}

const PayPalButtonContainer = ({ onSuccess, tier }: PayPalButtonContainerProps) => {
  const [loading, setLoading] = useState(false);
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
          // On approve handler
          async (data) => {
            setLoading(true);
            try {
              // Call your backend to verify and record the subscription
              const result = await createSubscription('paypal_subscription', `price_${tier}`);
              if (result.success) {
                toast.success(`${pricingTiers[tier].name} plan activated! You now have access to ${pricingTiers[tier].scans} compliance scans per month.`);
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
  }, [tier, onSuccess, loading]);
  
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

export default PayPalButtonContainer;
