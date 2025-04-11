
import { useState, useEffect } from 'react';

const MAX_RETRIES = 3;

export function usePayPalState(tier: string, billingCycle: 'monthly' | 'annually') {
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [paypalButtonsRendered, setPaypalButtonsRendered] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Effect for automatic retry
  useEffect(() => {
    if (paypalError && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        console.log(`Auto-retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        setRetryCount(prev => prev + 1);
        setPaypalButtonsRendered(false);
      }, 3000); // Wait 3 seconds before retry
      
      return () => clearTimeout(timer);
    }
  }, [paypalError, retryCount]);
  
  // Reset state when tier or billing cycle changes
  useEffect(() => {
    setRetryCount(0);
    setPaypalError(null);
    setPaypalButtonsRendered(false);
  }, [tier, billingCycle]);
  
  return {
    paypalError,
    setPaypalError,
    paypalButtonsRendered,
    setPaypalButtonsRendered,
    retryCount,
    setRetryCount,
    MAX_RETRIES
  };
}
