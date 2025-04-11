
/**
 * PayPal button creation service
 */
import { isPayPalSDKLoaded } from './paypalSDK';

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

/**
 * Create PayPal buttons
 */
export const createPayPalButtons = (
  containerId: string,
  plan: string,
  billingCycle: 'monthly' | 'annually',
  onApprove: (data: any) => void,
  onError: (err: any) => void
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Ensure PayPal SDK is loaded
    if (!isPayPalSDKLoaded()) {
      console.error('PayPal SDK not loaded when trying to create buttons');
      onError(new Error('PayPal SDK not loaded'));
      resolve(false);
      return;
    }

    // Find the container element
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      onError(new Error(`Container with ID ${containerId} not found`));
      resolve(false);
      return;
    }
    
    // Clear existing buttons if any
    container.innerHTML = '';

    // Skip PayPal integration for free plan
    if (plan === 'free') {
      console.log('Free plan selected, skipping PayPal integration');
      resolve(true);
      return;
    }

    // Get plan ID based on selected plan and billing cycle
    const planId = PAYPAL_PLAN_IDS[plan as keyof typeof PAYPAL_PLAN_IDS]?.monthly;
    if (!planId) {
      console.error(`No PayPal plan ID found for plan: ${plan}`);
      onError(new Error(`No PayPal plan ID found for plan: ${plan}`));
      resolve(false);
      return;
    }

    console.log(`Creating PayPal buttons for plan: ${plan}, planId: ${planId}`);

    try {
      // Verify that window.paypal.Buttons exists
      if (!window.paypal?.Buttons) {
        console.error('PayPal Buttons not available in SDK');
        onError(new Error('PayPal Buttons not available in SDK'));
        resolve(false);
        return;
      }
      
      // Create buttons configuration
      const paypalButtons = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'subscribe'
        },
        createSubscription: function(data: any, actions: any) {
          console.log('Creating subscription with plan ID:', planId);
          return actions.subscription.create({
            plan_id: planId
          });
        },
        onApprove: function(data: any, actions: any) {
          console.log('PayPal subscription approved:', data);
          // Handle subscription success
          onApprove(data);
        },
        onError: function(err: any) {
          console.error('PayPal error:', err);
          onError(err);
        },
        onCancel: function() {
          console.log('Subscription canceled by user');
        }
      });
      
      console.log('Checking if PayPal buttons are eligible for rendering');
      // Check if buttons are eligible for rendering
      if (!paypalButtons.isEligible()) {
        console.error('PayPal buttons not eligible for this browser/device');
        onError(new Error('PayPal not available for this browser/device'));
        resolve(false);
        return;
      }
      
      console.log(`PayPal buttons eligible, rendering in #${containerId}`);
      paypalButtons.render(`#${containerId}`).then(() => {
        console.log(`PayPal buttons rendered in #${containerId}`);
        resolve(true);
      }).catch((error: any) => {
        console.error('Error rendering PayPal buttons:', error);
        onError(error);
        resolve(false);
      });
    } catch (error) {
      console.error('Error rendering PayPal buttons:', error);
      onError(error);
      resolve(false);
    }
  });
};
