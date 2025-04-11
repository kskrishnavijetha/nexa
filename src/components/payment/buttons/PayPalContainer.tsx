
import React, { useEffect, useRef } from 'react';
import { loadPayPalScript, createPayPalButtons } from '@/utils/paymentService';
import { Loader2 } from 'lucide-react';

interface PayPalContainerProps {
  plan: string;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const PayPalContainer: React.FC<PayPalContainerProps> = ({
  plan,
  onSuccess,
  onError,
  loading,
  setLoading
}) => {
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip for free plan
    if (plan === 'free') return;
    
    // Only proceed if not already loading
    if (loading) return;
    
    const initializePayPal = async () => {
      try {
        console.log(`Initializing PayPal for plan: ${plan}`);
        setLoading(true);
        await loadPayPalScript();
        
        // Create PayPal buttons
        createPayPalButtons(
          'paypal-button-container',
          plan,
          'monthly', // Always using monthly billing cycle
          data => {
            console.log('PayPal subscription approved:', data);
            onSuccess(data);
          },
          err => {
            console.error('PayPal error:', err);
            onError(err);
          }
        );
      } catch (error) {
        console.error('Failed to load PayPal:', error);
        onError(error);
      } finally {
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
  }, [plan, onSuccess, onError, loading, setLoading]);

  return (
    <div className="w-full">
      {loading && (
        <div className="flex items-center justify-center py-2 mb-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Preparing PayPal...</span>
        </div>
      )}
      <div 
        id="paypal-button-container" 
        ref={paypalContainerRef}
        className="w-full min-h-[40px]"
        aria-label="PayPal payment options"
      />
    </div>
  );
};

export default PayPalContainer;
