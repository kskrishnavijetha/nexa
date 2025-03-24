
import { PaymentResult, DEV_MODE } from './types';
import { saveSubscription } from './subscriptionService';

/**
 * Process a one-time payment
 */
export const processOneTimePayment = async (
  paymentMethodId: string,
  amount: number
): Promise<PaymentResult> => {
  // Always use mock implementation in development mode
  try {
    // Free tier doesn't need payment processing
    if (amount === 0) {
      return {
        success: true,
        paymentId: 'free_' + Math.random().toString(36).substring(2, 15)
      };
    }
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (DEV_MODE) {
      console.log('DEV MODE: Simulating successful payment');
      return {
        success: true,
        paymentId: 'dev_pi_' + Math.random().toString(36).substring(2, 15)
      };
    }
    
    // Simulate successful payment ~90% of the time (only happens if not in dev mode)
    if (Math.random() > 0.1) {
      return {
        success: true,
        paymentId: 'pi_' + Math.random().toString(36).substring(2, 15)
      };
    } else {
      return {
        success: false,
        error: 'Payment declined. Please try a different payment method.'
      };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while processing your payment.'
    };
  }
};

/**
 * Create a subscription
 */
export const createSubscription = async (
  paymentMethodId: string,
  priceId: string
): Promise<PaymentResult> => {
  try {
    // Extract plan name from priceId (e.g., price_basic -> basic)
    const planName = priceId.split('_')[1];
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (DEV_MODE) {
      console.log(`DEV MODE: Simulating successful subscription to ${planName} plan`);
      const paymentId = 'dev_sub_' + Math.random().toString(36).substring(2, 15);
      
      // Save the subscription
      saveSubscription(planName, paymentId);
      
      return {
        success: true,
        paymentId: paymentId
      };
    }
    
    // If not in dev mode, use the existing logic
    // Free tier doesn't need subscription processing
    if (priceId === 'price_free') {
      const paymentId = 'free_sub_' + Math.random().toString(36).substring(2, 15);
      
      // Save the free subscription
      saveSubscription('free', paymentId);
      
      return {
        success: true,
        paymentId: paymentId
      };
    }
    
    // Simulate successful subscription creation ~90% of the time
    if (Math.random() > 0.1) {
      const paymentId = 'sub_' + Math.random().toString(36).substring(2, 15);
      
      // Save the subscription
      saveSubscription(planName, paymentId);
      
      return {
        success: true,
        paymentId: paymentId
      };
    } else {
      return {
        success: false,
        error: 'Unable to create subscription. Please try again.'
      };
    }
  } catch (error) {
    console.error('Subscription creation error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while creating your subscription.'
    };
  }
};

/**
 * Fetch customer payment methods (for returning customers)
 */
export const fetchPaymentMethods = async (): Promise<any[]> => {
  // Mock implementation - would fetch from your backend in a real app
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (DEV_MODE) {
    console.log('DEV MODE: Returning empty payment methods array');
  }
  
  // Return empty array for new customers or mock data for testing
  return [];
};
