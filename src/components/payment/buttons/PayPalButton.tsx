
import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loadPayPalScript, createPayPalButtons } from '@/utils/payment/paypalService';

interface PayPalButtonProps {
  tier: string;
  billingCycle: 'monthly' | 'annually';
  onSuccess: (paymentId: string) => void;
  onError: (error: any) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MAX_RETRIES = 2;

const PayPalButton: React.FC<PayPalButtonProps> = ({
  tier,
  billingCycle,
  onSuccess,
  onError,
  loading,
  setLoading
}) => {
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);
  const [isPayPalReady, setIsPayPalReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [paypalError, setPaypalError] = useState<string | null>(null);

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
    if (!scriptLoaded.current) {
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
                onError(error);
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
            onError('Failed to load payment system. Please refresh and try again.');
          }
        }
      };

      loadScript();
    }
  }, [tier, billingCycle, setLoading, onSuccess, onError, retryCount]);

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
          <button 
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100" 
            onClick={() => {
              setRetryCount(0);
              scriptLoaded.current = false;
            }}
          >
            Retry Loading Payment System
          </button>
        </div>
      )}
    </div>
  );
};

export default PayPalButton;
