
/**
 * Service for handling one-time payments
 */

import { PaymentResult } from './types';

/**
 * Process a one-time payment
 */
export const processOneTimePayment = async (
  paymentMethodId: string,
  amount: number
): Promise<PaymentResult> => {
  // This is a mock implementation. In a real app, you would call your backend.
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
    
    // Simulate successful payment ~90% of the time
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
