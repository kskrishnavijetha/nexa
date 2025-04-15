
import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { loadPayPalScript, createPayPalButtons } from '@/utils/payment/paypal';

interface PayPalButtonsProps {
  tier: string;
  billingCycle: 'monthly' | 'annually';
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: (paymentId: string) => void;
}

const MAX_RETRIES = 2;

const PayPalButtons: React.FC<PayPalButtonsProps> = ({
  tier,
  billingCycle,
  loading,
  setLoading,
  onSuccess
}) => {
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);
  const [isPayPalReady, setIsPayPalReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [paypalError, setPaypalError] = useState<string | null>(null);

  useEffect(() => {
    const loadScript = async () => {
      try {
        setLoading(true);
        setPaypalError(null);
        
        await loadPayPalScript();
        
        if (window.paypal && paypalContainerRef.current) {
          scriptLoaded.current = true;
          setIsPayPalReady(true);
          setLoading(false);
          
          createPayPalButtons({
            containerId: paypalContainerRef.current.id,
            plan: tier,
            billingCycle,
            onApprove: (data) => {
              console.log('PayPal subscription created:', data);
            },
            onError: (error) => {
              console.error('PayPal error:', error);
              toast.error('There was an error processing your subscription. Please try again.');
              setLoading(false);
            }
          });
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

    if (!scriptLoaded.current) {
      loadScript();
    }
  }, [tier, billingCycle, setLoading, retryCount]);

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
};

export default PayPalButtons;
