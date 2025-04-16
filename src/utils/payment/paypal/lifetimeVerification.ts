
/**
 * Module for lifetime payment verification
 */

import { saveSubscription } from '../subscriptionService';
import { toast } from 'sonner';

/**
 * Verify lifetime payment by PayPal transaction ID
 * In a real implementation, this would verify with a backend API
 * For now, we'll simulate a successful verification
 */
export const verifyLifetimePayment = async (transactionId: string): Promise<boolean> => {
  console.log('Verifying lifetime payment with transaction ID:', transactionId);
  
  // In a real implementation, you would call your backend to verify the payment
  // For demo purposes, we'll simulate a successful payment verification
  // Wait 1 second to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For this demo, we'll consider any transaction ID that starts with 'YF' as verified
  // In a real implementation, you'd check against actual PayPal transactions
  return transactionId.startsWith('YF');
};

/**
 * Process lifetime payment completion
 */
export const processLifetimePaymentCompletion = async (userId?: string): Promise<{success: boolean, message: string}> => {
  // Extract transaction ID from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const txnId = urlParams.get('txnId') || urlParams.get('txn_id');
  
  if (!txnId) {
    return {
      success: false,
      message: 'No transaction ID found. Payment verification failed.'
    };
  }
  
  try {
    // Verify the payment
    const isVerified = await verifyLifetimePayment(txnId);
    
    if (isVerified) {
      // Create lifetime subscription for the user
      const lifetimeSubscription = saveLifetimeSubscription(userId);
      
      console.log('Lifetime subscription created:', lifetimeSubscription);
      
      return {
        success: true,
        message: 'Lifetime access successfully activated! You now have unlimited access to all features.'
      };
    } else {
      return {
        success: false,
        message: 'Payment verification failed. Please contact support.'
      };
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      message: 'An error occurred while processing your payment. Please contact support.'
    };
  }
};

/**
 * Save a lifetime subscription to local storage
 */
export const saveLifetimeSubscription = (userId?: string) => {
  // Create a lifetime subscription object with unlimited scans
  // and a far future expiration date (10 years from now)
  const farFutureDate = new Date();
  farFutureDate.setFullYear(farFutureDate.getFullYear() + 10);
  
  const lifetimeSubscription = {
    active: true,
    plan: 'lifetime',
    scansUsed: 0,
    scansLimit: 9999, // Effectively unlimited
    expirationDate: farFutureDate,
    billingCycle: 'lifetime',
    userId: userId,
    isLifetime: true
  };
  
  // Store with user ID if available
  const storageKey = userId ? `subscription_${userId}` : 'subscription';
  localStorage.setItem(storageKey, JSON.stringify(lifetimeSubscription));
  
  return lifetimeSubscription;
};
