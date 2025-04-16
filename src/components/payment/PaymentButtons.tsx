import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { shouldUpgrade, saveSubscription } from '@/utils/paymentService';
import { loadPayPalScript, createPayPalButtons } from '@/utils/payment/paypalService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentButtonsProps {
  onSuccess?: (paymentId: string) => void;
  tier: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  billingCycle: 'monthly' | 'annually';
}

const MAX_RETRIES = 2;

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
  const [retryCount, setRetryCount] = useState(0);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const pendingSubscription = localStorage.getItem('pendingSubscription');
    if (pendingSubscription) {
      try {
        const subData = JSON.parse(pendingSubscription);
        console.log('Found pending subscription:', subData);
        
        localStorage.removeItem('pendingSubscription');
        
        if (subData.subscriptionID) {
          toast.success(`${subData.plan.charAt(0).toUpperCase() + subData.plan.slice(1)} plan subscription created successfully!`);
          onSuccess(subData.subscriptionID);
        }
      } catch (error) {
        console.error('Error processing pending subscription:', error);
      }
    }
  }, [onSuccess]);

  useEffect(() => {
    if ((tier === 'starter' || tier === 'pro' || tier === 'enterprise') && !scriptLoaded.current) {
      const loadScript = async () => {
        try {
          setLoading(true);
          setPaypalError(null);
          
          await loadPayPalScript();
          
          if (window.paypal && paypalContainerRef.current) {
            scriptLoaded.current = true;
            setIsPayPalReady(true);
            setLoading(false);
            
            createPayPalButtons(
              paypalContainerRef.current.id,
              tier,
              billingCycle,
              (data) => {
                console.log('PayPal subscription created:', data);
              },
              (error) => {
                console.error('PayPal error:', error);
                toast.error('There was an error processing your subscription. Please try again.');
                setLoading(false);
              }
            );
          }
        } catch (error) {
          console.error('Failed to load PayPal script:', error);
          setPaypalError(error instanceof Error ? error.message : 'Failed to load payment system');
          setLoading(false);
          
          if (retryCount < MAX_RETRIES) {
            const nextRetry = retryCount + 1;
            setRetryCount(nextRetry);
            console.log(`Retrying PayPal script load (${nextRetry}/${MAX_RETRIES})...`);
            
            setTimeout(() => {
              scriptLoaded.current = false;
            }, 2000);
          } else {
            toast.error('Failed to load payment system. Please refresh and try again.');
          }
        }
      };

      loadScript();
    }
  }, [tier, billingCycle, setLoading, onSuccess, retryCount]);

  const needsUpgrade = tier !== 'free' || (user && shouldUpgrade(user.id));
  const buttonText = tier === 'free' 
    ? (needsUpgrade ? 'Select a Paid Plan' : 'Activate Free Plan')
    : `Subscribe to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`;
  
  if (tier === 'starter' || tier === 'pro' || tier === 'enterprise') {
    return (
      <div className="w-full">
        <div id="paypal-button-container" ref={paypalContainerRef} className="w-full"></div>
        
        {loading && (
          <div className="flex justify-center items-center mt-2">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Preparing payment options...</span>
          </div>
        )}
        
        {paypalError && !loading && (
          <div className="mt-4">
            <p className="text-red-500 text-sm mb-2">
              {paypalError}
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setRetryCount(0);
                scriptLoaded.current = false;
              }}
              className="w-full"
            >
              Retry Loading Payment System
            </Button>
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
            toast.info('Please select a paid plan to continue');
            setLoading(false);
            return;
          }
          
          const subscriptionId = tier + '_' + Math.random().toString(36).substring(2, 15);
          
          saveSubscription(tier, subscriptionId, 'monthly', user?.id);
          
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
