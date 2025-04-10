
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { 
  loadPayPalScript,
  createPayPalButtons
} from '@/utils/paymentService';
import { toast } from 'sonner';
import { shouldUpgrade } from '@/utils/paymentService';

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
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  
  useEffect(() => {
    // For free tier, create a custom button instead of PayPal
    if (tier === 'free') {
      return;
    }
    
    // Only proceed if not already loading
    if (loading) return;
    
    // Load PayPal script
    const initializePayPal = async () => {
      try {
        console.log(`Initializing PayPal for tier: ${tier}, billing cycle: ${billingCycle}`);
        setLoading(true);
        await loadPayPalScript();
        setPaypalLoaded(true);
        
        // Create PayPal buttons
        createPayPalButtons(
          'paypal-button-container',
          tier,
          billingCycle,
          // On approve handler
          async (data) => {
            console.log('PayPal subscription approved:', data);
            try {
              // Save the subscription locally
              const subscriptionId = data.subscriptionID || 'paypal_sub_id';
              toast.success(`${tier.charAt(0).toUpperCase() + tier.slice(1)} plan activated!`);
              onSuccess(subscriptionId);
            } catch (error) {
              console.error('Subscription processing error:', error);
              toast.error('Failed to process subscription. Please try again.');
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
        setLoading(false);
      } catch (error) {
        console.error('Failed to load PayPal:', error);
        toast.error('Failed to load PayPal. Please try again later.');
        setLoading(false);
      }
    };
    
    initializePayPal();
    
    // Cleanup function
    return () => {
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = '';
      }
    };
  }, [tier, billingCycle, onSuccess, loading, setLoading]);
  
  // For free tier, use a regular button
  if (tier === 'free') {
    const needsUpgrade = shouldUpgrade();
    const buttonText = needsUpgrade ? 'Select a Paid Plan' : 'Activate Free Plan';
    
    return (
      <Button 
        className="w-full"
        disabled={loading}
        onClick={async () => {
          if (loading) return;
          setLoading(true);
          
          try {
            if (needsUpgrade) {
              // If they need to upgrade, just show paid plans
              toast.info('Please select a paid plan to continue');
              setLoading(false);
              return;
            }
            
            // For free tier, just create a local subscription record
            const subscriptionId = 'free_' + Math.random().toString(36).substring(2, 15);
            toast.success('Free plan activated!');
            onSuccess(subscriptionId);
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
        {loading ? 'Processing...' : buttonText}
      </Button>
    );
  }
  
  // For paid plans, render the PayPal button container and fallback button
  return (
    <div className="w-full space-y-4">
      {loading && (
        <div className="flex items-center justify-center py-2 mb-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Preparing payment options...</span>
        </div>
      )}
      <div 
        id="paypal-button-container" 
        ref={paypalContainerRef}
        className="w-full min-h-[40px]"
      />
      
      {!paypalLoaded && !loading && (
        <div className="text-center text-sm text-muted-foreground">
          <p>PayPal options are loading...</p>
        </div>
      )}
      
      {/* Fallback credit card payment option */}
      <div className="text-center">
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              or pay with credit card
            </span>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full"
          disabled={loading}
          onClick={() => {
            toast.info("Credit card payment functionality coming soon!");
          }}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Pay with Credit Card
        </Button>
      </div>
    </div>
  );
};

export default PaymentButtons;
