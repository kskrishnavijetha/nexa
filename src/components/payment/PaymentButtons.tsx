
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

  // Effect for PayPal integration for basic tier
  useEffect(() => {
    if (tier === 'basic' && !scriptLoaded.current) {
      const loadScript = async () => {
        try {
          await loadPayPalScript();
          
          if (window.paypal && paypalContainerRef.current) {
            scriptLoaded.current = true;
            
            window.paypal.Buttons({
              style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'paypal'
              },
              createSubscription: function(data: any, actions: any) {
                return actions.subscription.create({
                  /* Creates the subscription */
                  plan_id: 'P-0G576384KT1375804M7UPCYY'
                });
              },
              onApprove: function(data: any, actions: any) {
                // Handle successful subscription
                console.log('Subscription created:', data.subscriptionID);
                onSuccess(data.subscriptionID);
                toast.success('Basic plan subscription created successfully!');
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

  // For free tier and other tiers (not basic), use a regular button
  const needsUpgrade = tier !== 'free' || shouldUpgrade();
  const buttonText = tier === 'free' 
    ? (needsUpgrade ? 'Select a Paid Plan' : 'Activate Free Plan')
    : `Subscribe to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`;
  
  if (tier === 'basic') {
    return (
      <div className="w-full">
        <div id="paypal-button-container-P-0G576384KT1375804M7UPCYY" ref={paypalContainerRef} className="w-full"></div>
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
