
/**
 * Service for payment processing
 */
import { saveSubscription } from './subscriptionService';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

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

/**
 * Send payment confirmation email
 */
const sendPaymentConfirmationEmail = async (email: string, plan: string, billingCycle: 'monthly' | 'annually') => {
  try {
    const amount = calculatePlanAmount(plan, billingCycle);
    
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'payment-confirmation',
        email,
        planDetails: {
          plan,
          billingCycle,
          amount
        }
      }
    });
    
    if (error) {
      console.error('Error sending payment confirmation email:', error);
    }
  } catch (err) {
    console.error('Failed to send payment confirmation email:', err);
  }
};

/**
 * Helper to calculate plan amount in cents
 */
const calculatePlanAmount = (plan: string, billingCycle: 'monthly' | 'annually'): number => {
  const pricing = {
    free: 0,
    basic: billingCycle === 'monthly' ? 3500 : 37800,
    pro: billingCycle === 'monthly' ? 11000 : 118800,
    enterprise: billingCycle === 'monthly' ? 39900 : 430900,
  };
  
  return pricing[plan as keyof typeof pricing] || 0;
};

/**
 * Create a subscription
 */
export const createSubscription = async (
  paymentMethodId: string,
  priceId: string
): Promise<PaymentResult> => {
  // This is a mock implementation. In a real app, you would call your backend.
  try {
    // Extract billing cycle from priceId if present (e.g., price_basic_annually)
    let planName = priceId.split('_')[1];
    let billingCycle: 'monthly' | 'annually' = 'monthly';
    
    // Check if there's a billing cycle in the price ID
    if (priceId.includes('_annually')) {
      billingCycle = 'annually';
    }
    
    // Free tier doesn't need subscription processing
    if (planName === 'free') {
      const paymentId = 'free_sub_' + Math.random().toString(36).substring(2, 15);
      
      // Save the free subscription
      saveSubscription('free', paymentId);
      
      return {
        success: true,
        paymentId: paymentId
      };
    }
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful subscription creation ~90% of the time
    if (Math.random() > 0.1) {
      const paymentId = 'sub_' + Math.random().toString(36).substring(2, 15);
      
      // Save the subscription with billing cycle
      saveSubscription(planName, paymentId, billingCycle);
      
      // Get current user email for confirmation
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.email) {
        // Send payment confirmation email
        await sendPaymentConfirmationEmail(user.email, planName, billingCycle);
      }
      
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
  
  // Return empty array for new customers or mock data for testing
  return [];
};
