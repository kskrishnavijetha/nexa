
import { PAYPAL_CLIENT_ID, PAYPAL_PLAN_IDS } from './types';
import { saveSubscription } from './subscriptionService';

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

  // Get plan ID based on selected plan
  const planId = PAYPAL_PLAN_IDS[plan as keyof typeof PAYPAL_PLAN_IDS];
  if (!planId) {
    console.error(`No PayPal plan ID found for plan: ${plan}`);
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
