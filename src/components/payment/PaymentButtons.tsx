
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { shouldUpgrade } from '@/utils/paymentService';
import { loadPayPalScript } from '@/utils/payment/paypalService';

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

  // Effect for PayPal integration for paid tiers
  useEffect(() => {
    if ((tier === 'basic' || tier === 'pro' || tier === 'enterprise') && !scriptLoaded.current) {
      const loadScript = async () => {
        try {
          await loadPayPalScript();
          
          if (window.paypal && paypalContainerRef.current) {
            scriptLoaded.current = true;
            
            // Select the appropriate plan ID based on the tier
            let planId;
            let containerId;
            
            if (tier === 'basic') {
              planId = 'P-0G576384KT1375804M7UPCYY';
              containerId = 'paypal-button-container-P-0G576384KT1375804M7UPCYY';
            } else if (tier === 'pro') {
              planId = 'P-0F289070AR785993EM7UO47Y';
              containerId = 'paypal-button-container-P-0F289070AR785993EM7UO47Y';
            } else if (tier === 'enterprise') {
              planId = 'P-76C19200WU898035NM7UO5YQ';
              containerId = 'paypal-button-container-P-76C19200WU898035NM7UO5YQ';
            }
            
            window.paypal.Buttons({
              style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: tier === 'basic' ? 'paypal' : 'subscribe'
              },
              createSubscription: function(data: any, actions: any) {
                return actions.subscription.create({
                  /* Creates the subscription */
                  plan_id: planId
                });
              },
              onApprove: function(data: any, actions: any) {
                // Handle successful subscription
                console.log('Subscription created:', data.subscriptionID);
                onSuccess(data.subscriptionID);
                toast.success(`${tier.charAt(0).toUpperCase() + tier.slice(1)} plan subscription created successfully!`);
              },
              onError: function(err: any) {
                console.error('PayPal error:', err);
                toast.error('There was an error processing your subscription. Please try again.');
              }
            }).render(paypalContainerRef.current);
          }
        } catch (error) {
          console.error('Failed to load PayPal script:', error);
          toast.error('Failed to load payment system. Please refresh and try again.');
        }
      };

      loadScript();
    }
  }, [tier, onSuccess]);

  // For free tier, use a regular button
  const needsUpgrade = tier !== 'free' || shouldUpgrade();
  const buttonText = tier === 'free' 
    ? (needsUpgrade ? 'Select a Paid Plan' : 'Activate Free Plan')
    : `Subscribe to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`;
  
  // For paid tiers, use PayPal buttons
  if (tier === 'basic' || tier === 'pro' || tier === 'enterprise') {
    let containerId;
    
    if (tier === 'basic') {
      containerId = 'paypal-button-container-P-0G576384KT1375804M7UPCYY';
    } else if (tier === 'pro') {
      containerId = 'paypal-button-container-P-0F289070AR785993EM7UO47Y';
    } else {
      containerId = 'paypal-button-container-P-76C19200WU898035NM7UO5YQ';
    }
    
    return (
      <div className="w-full">
        <div id={containerId} ref={paypalContainerRef} className="w-full"></div>
        {loading && (
          <div className="flex justify-center items-center mt-2">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Processing...</span>
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
