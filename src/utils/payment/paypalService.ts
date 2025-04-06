
/**
 * Service for PayPal payment processing
 */
import { saveSubscription } from './subscriptionService';
import type { PaymentResult } from './paymentProcessor';

// PayPal client ID - Replace with your actual PayPal client ID
const PAYPAL_CLIENT_ID = 'AXKd2EHw7ySZihlaN06rqnABzzQdhD8ueu738V8iCtC93o8PwlZdjO7hwVITJgTsmjOq8dHJaC1vMMKT';

// PayPal plan IDs - Replace with your actual plan IDs
const PAYPAL_PLAN_IDS = {
  basic: {
    monthly: 'P-9HD8411875146223CMUSBMCA',
    annually: 'P-ANNUAL8411875146223CMUSBMCA'
  },
  pro: {
    monthly: 'P-3NN72537D3262274CMUSBMDI',
    annually: 'P-ANNUAL72537D3262274CMUSBMDI'
  },
  enterprise: {
    monthly: 'P-5GJ8318862350144UMUSBMEI',
    annually: 'P-ANNUAL8318862350144UMUSBMEI'
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
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=subscription`;
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
    return;
  }

  // Clear existing buttons if any
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }

  // Skip PayPal integration for free plan
  if (plan === 'free') {
    return;
  }

  // Get plan ID based on selected plan and billing cycle
  const planId = PAYPAL_PLAN_IDS[plan as keyof typeof PAYPAL_PLAN_IDS]?.[billingCycle];
  if (!planId) {
    console.error(`No PayPal plan ID found for plan: ${plan} (${billingCycle})`);
    return;
  }

  try {
    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'subscribe'
      },
      createSubscription: function(data: any, actions: any) {
        return actions.subscription.create({
          plan_id: planId
        });
      },
      onApprove: function(data: any, actions: any) {
        console.log('Subscription approved:', data);
        onApprove(data);
      },
      onError: function(err: any) {
        console.error('PayPal error:', err);
        onError(err);
      }
    }).render(`#${containerId}`);
  } catch (error) {
    console.error('Error rendering PayPal buttons:', error);
    onError(error);
  }
};
