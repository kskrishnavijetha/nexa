
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { 
  loadPayPalScript,
  createPayPalButtons,
  isPayPalSDKLoaded
} from '@/utils/paymentService';
import { saveSubscription } from '@/utils/paymentService';
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
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [paypalButtonsRendered, setPaypalButtonsRendered] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const initializePayPal = async () => {
    if (tier === 'free') return;
    
    try {
      console.log(`Initializing PayPal for tier: ${tier}, billing cycle: ${billingCycle}`);
      setLoading(true);
      setPaypalError(null);
      
      // Load the PayPal SDK
      await loadPayPalScript();
      console.log("PayPal script loaded successfully");
      
      if (!isPayPalSDKLoaded()) {
        throw new Error('PayPal SDK did not load correctly');
      }
      
      // Create PayPal buttons
      const buttonsRendered = await createPayPalButtons(
        'paypal-button-container',
        tier,
        billingCycle,
        // On approve handler
        async (data) => {
          console.log('PayPal subscription approved:', data);
          try {
            // Save the subscription locally
            const subscriptionId = data.subscriptionID || 'paypal_sub_id';
            // Create a subscription record
            saveSubscription(tier, subscriptionId, billingCycle);
            
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
          setPaypalError('Failed to load PayPal. Please try again later.');
          toast.error('PayPal payment failed. Please try again.');
          setLoading(false);
        }
      );
      
      setPaypalButtonsRendered(buttonsRendered);
      setLoading(false);
      
    } catch (error) {
      console.error('Failed to initialize PayPal:', error);
      setPaypalError('Failed to load PayPal. Please try again later.');
      toast.error('Failed to load PayPal. Please try again later.');
      setLoading(false);
    }
  };
  
  // Effect for automatic retry
  useEffect(() => {
    if (paypalError && retryCount < 2) {
      const timer = setTimeout(() => {
        console.log(`Auto-retry attempt ${retryCount + 1}`);
        setRetryCount(prev => prev + 1);
        setPaypalButtonsRendered(false);
        initializePayPal();
      }, 3000); // Wait 3 seconds before retry
      
      return () => clearTimeout(timer);
    }
  }, [paypalError, retryCount]);
  
  useEffect(() => {
    // Only initialize PayPal for paid plans and if buttons aren't already rendered
    if (tier !== 'free' && !paypalButtonsRendered && !loading) {
      // Small delay to ensure the container is ready
      const timer = setTimeout(() => {
        initializePayPal();
      }, 300);
      
      return () => clearTimeout(timer);
    }
    
    // Cleanup function
    return () => {
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = '';
      }
      setPaypalButtonsRendered(false);
    };
  }, [tier, billingCycle]);
  
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
            saveSubscription('free', subscriptionId, 'monthly');
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
  
  // For paid plans, render the PayPal button container
  return (
    <div className="w-full">
      {loading && (
        <div className="flex items-center justify-center py-2 mb-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Preparing payment options...</span>
        </div>
      )}
      
      {paypalError && (
        <div className="text-red-500 text-center mb-4">
          {paypalError}
          <Button 
            variant="outline" 
            className="block mx-auto mt-2"
            onClick={() => {
              // Reset the error and retry
              setPaypalError(null);
              setPaypalButtonsRendered(false);
              setLoading(false);
              // Force re-initialization
              initializePayPal();
            }}
          >
            Retry
          </Button>
        </div>
      )}
      
      <div 
        id="paypal-button-container" 
        ref={paypalContainerRef}
        className="w-full min-h-[40px]"
        style={{ minHeight: '150px' }}
      />
    </div>
  );
};

export default PaymentButtons;
