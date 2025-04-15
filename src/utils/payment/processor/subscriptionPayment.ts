
/**
 * Service for handling subscription payments
 */

import { PaymentResult } from './types';
import { saveSubscription } from '../subscription';
import { supabase } from '@/integrations/supabase/client';

/**
 * Send payment confirmation email
 */
export const sendPaymentConfirmationEmail = async (email: string, plan: string, billingCycle: 'monthly' | 'annually') => {
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
export const calculatePlanAmount = (plan: string, billingCycle: 'monthly' | 'annually'): number => {
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
      
      // Save the free subscription (now in Supabase)
      await saveSubscription('free', paymentId);
      
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
      
      // Save the subscription with billing cycle (now in Supabase)
      await saveSubscription(planName, paymentId, billingCycle);
      
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
