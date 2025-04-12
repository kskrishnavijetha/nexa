
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
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
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [loadingPayPal, setLoadingPayPal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
  const loadPayPalSDK = async () => {
    if ((tier === 'basic' || tier === 'pro' || tier === 'enterprise') && !scriptLoaded.current) {
      try {
        setLoading(true);
        setLoadingPayPal(true);
        setPaypalError(null);
        await loadPayPalScript();
        
        if (window.paypal && paypalContainerRef.current) {
          scriptLoaded.current = true;
          setIsPayPalReady(true);
          
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
              setPaypalError('There was an error processing your subscription. Please try again.');
              setLoading(false);
            }
          );
        }
        setLoading(false);
        setLoadingPayPal(false);
      } catch (error) {
        console.error('Failed to load PayPal script:', error);
        setPaypalError('Failed to load payment system. Please refresh and try again.');
        setLoading(false);
        setLoadingPayPal(false);
      }
    }
  };

  useEffect(() => {
    loadPayPalSDK();
  }, [tier, billingCycle, setLoading, onSuccess]);

  // For free tier, use a regular button
  const needsUpgrade = tier !== 'free' || shouldUpgrade();
  const buttonText = tier === 'free' 
    ? (needsUpgrade ? 'Select a Paid Plan' : 'Activate Free Plan')
    : `Subscribe to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`;
  
  const handleRetry = () => {
    scriptLoaded.current = false;
    setPaypalError(null);
    setIsPayPalReady(false);
    loadPayPalSDK();
  };
  
  // For paid tiers, use PayPal buttons
  if (tier === 'basic' || tier === 'pro' || tier === 'enterprise') {
    return (
      <div className="w-full">
        <div id="paypal-button-container" ref={paypalContainerRef} className="w-full"></div>
        
        {loadingPayPal && (
          <div className="flex justify-center items-center mt-2">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Loading payment system...</span>
          </div>
        )}
        
        {paypalError && (
          <div className="mt-4 text-center">
            <p className="text-red-500 text-sm mb-2">{paypalError}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRetry}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Loading PayPal
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
