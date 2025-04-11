
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { 
  isPayPalSDKLoaded,
  loadPayPalScript, 
  createPayPalButtons
} from '@/utils/paymentService';

interface PayPalContainerProps {
  tier: string;
  billingCycle: 'monthly' | 'annually';
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onApprove: (data: any) => void;
  onError: (err: any) => void;
  retryCount: number;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
  paypalError: string | null;
  setPaypalError: React.Dispatch<React.SetStateAction<string | null>>;
  setPaypalButtonsRendered: React.Dispatch<React.SetStateAction<boolean>>;
}

const PayPalContainer: React.FC<PayPalContainerProps> = ({
  tier,
  billingCycle,
  loading,
  setLoading,
  onApprove,
  onError,
  paypalError,
  setPaypalError,
  retryCount, 
  setRetryCount,
  setPaypalButtonsRendered
}) => {
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  
  const initializePayPal = async () => {
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
            onApprove,
            onError
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
      setLoading(false);
    }
  };

  const handleRetry = () => {
    // Reset the error and retry
    setPaypalError(null);
    setPaypalButtonsRendered(false);
    setLoading(false);
    // Force re-initialization
    initializePayPal();
  };
  
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
            onClick={handleRetry}
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

export default PayPalContainer;
