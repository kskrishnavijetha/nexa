
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
  const maxRetries = 3;
  
  const initializePayPal = async () => {
    if (tier === 'free') return;
    
    try {
      console.log(`Initializing PayPal for tier: ${tier}, billing cycle: ${billingCycle}`);
      setLoading(true);
      setPaypalError(null);
      
      // Clear the container before attempting to render
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = '';
      }
      
      // Load the PayPal SDK with error handling
      try {
        await loadPayPalScript();
        console.log("PayPal script loaded successfully, waiting for DOM update");
      } catch (error) {
        console.error("Failed to load PayPal script:", error);
        throw new Error("PayPal SDK failed to load. Please check your internet connection and try again.");
      }
      
      // Give the DOM a moment to update after script load
      setTimeout(async () => {
        try {
          if (!isPayPalSDKLoaded()) {
            throw new Error('PayPal SDK did not load correctly');
          }
          
          if (!paypalContainerRef.current) {
            throw new Error('PayPal container not found in DOM');
          }
          
          // Create PayPal buttons
          console.log("Creating PayPal buttons...");
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
          
          console.log("PayPal buttons creation result:", buttonsRendered ? "Success" : "Failed");
          setPaypalButtonsRendered(buttonsRendered);
          setLoading(false);
        } catch (error) {
          console.error("Error setting up PayPal buttons:", error);
          setPaypalError(`Failed to set up PayPal: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setLoading(false);
        }
      }, 1500); // Increased timeout to ensure DOM is ready
      
    } catch (error) {
      console.error('Failed to initialize PayPal:', error);
      setPaypalError('Failed to load PayPal. Please try again later.');
      toast.error('Failed to load PayPal. Please try again later.');
      setLoading(false);
    }
  };
  
  // Effect for automatic retry
  useEffect(() => {
    if (paypalError && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        console.log(`Auto-retry attempt ${retryCount + 1} of ${maxRetries}`);
        setRetryCount(prev => prev + 1);
        setPaypalButtonsRendered(false);
        initializePayPal();
      }, 3000); // Wait 3 seconds before retry
      
      return () => clearTimeout(timer);
    } else if (retryCount >= maxRetries && paypalError) {
      toast.error("Maximum retry attempts reached. Please refresh the page and try again.");
    }
  }, [paypalError, retryCount]);
  
  // Initialize PayPal when component mounts or tier/billing cycle changes
  useEffect(() => {
    if (paypalContainerRef.current) {
      paypalContainerRef.current.innerHTML = '';
      setPaypalButtonsRendered(false);
    }
    
    // Reset retry count when component rerenders with new props
    setRetryCount(0);
    setPaypalError(null);
    
    // Only initialize PayPal for paid plans and if buttons aren't already rendered
    if (tier !== 'free' && !paypalButtonsRendered && !loading) {
      // Small delay to ensure the container is ready
      const timer = setTimeout(() => {
        initializePayPal();
      }, 500);
      
      return () => clearTimeout(timer);
    }
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
      
      {!loading && !paypalError && (
        <div className="text-center mb-2 text-sm text-muted-foreground">
          PayPal subscription will be processed securely
        </div>
      )}
      
      <div 
        id="paypal-button-container" 
        ref={paypalContainerRef}
        className="w-full min-h-[150px] border border-dashed border-gray-200 rounded-md flex items-center justify-center"
      />
    </div>
  );
};

export default PaymentButtons;
