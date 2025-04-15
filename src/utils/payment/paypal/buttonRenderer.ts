
/**
 * Service for rendering PayPal buttons
 */

import { PayPalButtonOptions } from './types';
import { PAYPAL_PLAN_IDS } from './config';

/**
 * Create PayPal buttons
 */
export const createPayPalButtons = ({
  containerId,
  plan,
  billingCycle,
  onApprove,
  onError
}: PayPalButtonOptions): void => {
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
    // Create the application return URL
    const appUrl = window.location.href.split('?')[0].split('#')[0]; // Clean URL
    const appBasePath = appUrl.endsWith('/payment') ? appUrl : (appUrl.endsWith('/') ? `${appUrl}payment` : `${appUrl}/payment`);
    
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
          plan_id: planId,
          application_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'CONTINUE',
            return_url: appBasePath,
            cancel_url: appBasePath,
            brand_name: 'ComplianceGuard',
            no_shipping: 1
          }
        });
      },
      onApprove: function(data: any, actions: any) {
        console.log('Subscription approved:', data);
        // Handle subscription success
        onApprove(data);
        // Save subscription data to local storage before PayPal redirects
        const subscriptionDetails = {
          subscriptionID: data.subscriptionID,
          plan: plan,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('pendingSubscription', JSON.stringify(subscriptionDetails));
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
