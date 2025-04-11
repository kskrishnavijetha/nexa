/**
 * Service for PayPal payment processing
 */
import { saveSubscription } from './subscriptionService';
import type { PaymentResult } from './paymentProcessor';

// PayPal client ID - Replace with your actual PayPal client ID
const PAYPAL_CLIENT_ID = 'AXKd2EHw7ySZihlaN06rqnABzzQdhD8ueu738V8iCtC93o8PwlZdjO7hwVITJgTsmjOq8dHJaC1vMMKT';

// PayPal plan IDs - Updated with actual plan IDs for monthly only
const PAYPAL_PLAN_IDS = {
  basic: {
    monthly: 'P-0G576384KT1375804M7UPCYY'
  },
  pro: {
    monthly: 'P-0F289070AR785993EM7UO47Y'
  },
  enterprise: {
    monthly: 'P-76C19200WU898035NM7UO5YQ'
  }
};

// Type definitions for PayPal
declare global {
  interface Window {
    paypal?: any;
  }
}

/**
 * Load PayPal SDK
 */
export const loadPayPalScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.paypal) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=subscription&vault=true`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
    document.body.appendChild(script);
  });
};

/**
 * Create PayPal buttons
 */
export const createPayPalButtons = (
  containerId: string,
  plan: string,
  billingCycle: 'monthly' | 'annually',
  onApprove: (data: any) => void,
  onError: (err: any) => void
): void => {
  if (!window.paypal) {
    console.error('PayPal SDK not loaded');
    onError(new Error('PayPal SDK not loaded'));
    return;
  }

  // Clear existing buttons if any
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  } else {
    console.error(`Container with ID ${containerId} not found`);
    onError(new Error(`Container with ID ${containerId} not found`));
    return;
  }

  // Skip PayPal integration for free plan
  if (plan === 'free') {
    console.log('Free plan selected, skipping PayPal integration');
    return;
  }

  // Get plan ID based on selected plan (always using monthly now)
  const planId = PAYPAL_PLAN_IDS[plan as keyof typeof PAYPAL_PLAN_IDS]?.monthly;
  if (!planId) {
    console.error(`No PayPal plan ID found for plan: ${plan}`);
    onError(new Error(`No PayPal plan ID found for plan: ${plan}`));
    return;
  }

  console.log(`Creating PayPal buttons for plan: ${plan}, planId: ${planId}`);

  try {
    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: plan === 'basic' ? 'paypal' : 'subscribe'
      },
      createSubscription: function(data: any, actions: any) {
        console.log('Creating subscription with plan ID:', planId);
        return actions.subscription.create({
          plan_id: planId
        });
      },
      onApprove: function(data: any, actions: any) {
        console.log('Subscription approved:', data);
        // Handle subscription success
        onApprove(data);
      },
      onError: function(err: any) {
        console.error('PayPal error:', err);
        onError(err);
      }
    }).render(`#${containerId}`);
    
    console.log(`PayPal buttons rendered in #${containerId}`);
  } catch (error) {
    console.error('Error rendering PayPal buttons:', error);
    onError(error);
  }
};
