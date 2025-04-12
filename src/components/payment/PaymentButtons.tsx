
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { shouldUpgrade } from '@/utils/paymentService';
import { loadPayPalScript, createPayPalButtons } from '@/utils/payment/paypalService';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const scriptLoaded = useRef(false);
  const [isPayPalReady, setIsPayPalReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const loadAttempts = useRef(0);
  const maxLoadAttempts = 3;

  // Function to load PayPal script with retry logic
  const attemptLoadPayPal = async () => {
    if (loadAttempts.current >= maxLoadAttempts) {
      setLoadError("Failed to load payment system after multiple attempts. Please try again later.");
      setLoading(false);
      return;
    }
    
    loadAttempts.current += 1;
    try {
      setLoading(true);
      setLoadError(null);
      console.log(`Attempting to load PayPal script (attempt ${loadAttempts.current})`);
      await loadPayPalScript();
      scriptLoaded.current = true;
      setIsPayPalReady(true);
      setLoading(false);
    } catch (error) {
      console.error('PayPal script loading error:', error);
      setLoading(false);
      setLoadError(`Failed to load payment system: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Check for pending subscriptions on component mount
  useEffect(() => {
    const pendingSubscription = localStorage.getItem('pendingSubscription');
    if (pendingSubscription) {
      try {
        const subData = JSON.parse(pendingSubscription);
        console.log('Found pending subscription:', subData);
        
        // Clear the pending subscription
        localStorage.removeItem('pendingSubscription');
        
        // Process the subscription
        if (subData.subscriptionID) {
          toast.success(`${subData.plan.charAt(0).toUpperCase() + subData.plan.slice(1)} plan subscription created successfully!`);
          onSuccess(subData.subscriptionID);
        }
      } catch (error) {
        console.error('Error processing pending subscription:', error);
      }
    }
  }, [onSuccess]);

  // Effect for PayPal integration for paid tiers
  useEffect(() => {
    if ((tier === 'basic' || tier === 'pro' || tier === 'enterprise') && !scriptLoaded.current) {
      attemptLoadPayPal();
    }
  }, [tier, billingCycle]);

  // Effect to create PayPal buttons once script is loaded
  useEffect(() => {
    if (isPayPalReady && paypalContainerRef.current && 
        (tier === 'basic' || tier === 'pro' || tier === 'enterprise')) {
      
      createPayPalButtons(
        paypalContainerRef.current.id,
        tier,
        billingCycle,
        (data) => {
          console.log('PayPal subscription created:', data);
          // The redirect will happen automatically, but we save the data beforehand
        },
        (error) => {
          console.error('PayPal error:', error);
          toast.error('There was an error processing your subscription. Please try again.');
          setLoading(false);
        }
      );
    }
  }, [isPayPalReady, tier, billingCycle, onSuccess]);

  // For free tier, use a regular button
  const needsUpgrade = tier !== 'free' || shouldUpgrade();
  const buttonText = tier === 'free' 
    ? (needsUpgrade ? 'Select a Paid Plan' : 'Activate Free Plan')
    : `Subscribe to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`;
  
  // For paid tiers, use PayPal buttons
  if (tier === 'basic' || tier === 'pro' || tier === 'enterprise') {
    return (
      <div className="w-full">
        {loadError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            <p>{loadError}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => attemptLoadPayPal()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Retrying...
                </>
              ) : (
                'Try Again'
              )}
            </Button>
          </div>
        )}

        <div id="paypal-button-container" ref={paypalContainerRef} className="w-full"></div>
        
        {loading && !loadError && (
          <div className="flex justify-center items-center mt-2">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Loading payment options...</span>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Button 
      className="w-full"
      disabled={loading}
      onClick={async () => {
        if (loading) return;
        setLoading(true);
        
        try {
          if (tier === 'free' && needsUpgrade) {
            // If they need to upgrade, just show paid plans
            toast.info('Please select a paid plan to continue');
            setLoading(false);
            return;
          }
          
          // Generate a simple subscription ID
          const subscriptionId = tier + '_' + Math.random().toString(36).substring(2, 15);
          toast.success(`${tier.charAt(0).toUpperCase() + tier.slice(1)} plan activated!`);
          onSuccess(subscriptionId);
        } catch (error) {
          toast.error(`Failed to activate ${tier} plan. Please try again.`);
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
};

export default PaymentButtons;
