
/**
 * Service for PayPal payment processing
 */
import { saveSubscription } from './subscriptionService';
import type { PaymentResult } from './paymentProcessor';

// PayPal client ID - Replace with your actual PayPal client ID
const PAYPAL_CLIENT_ID = 'AXKd2EHw7ySZihlaN06rqnABzzQdhD8ueu738V8iCtC93o8PwlZdjO7hwVITJgTsmjOq8dHJaC1vMMKT';

// PayPal plan IDs - Monthly plans only
const PAYPAL_PLAN_IDS = {
  basic: {
    monthly: 'P-0G576384KT1375804M7UPCYY',
  },
  pro: {
    monthly: 'P-0F289070AR785993EM7UO47Y',
  },
  enterprise: {
    monthly: 'P-76C19200WU898035NM7UO5YQ',
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
      console.log('PayPal SDK already loaded, using existing instance');
      resolve();
      return;
    }

    // Remove any existing PayPal scripts to prevent conflicts
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    console.log('Loading PayPal SDK...');
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.dataset.sdkIntegrationSource = 'button-factory';
    script.async = true;
    
    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
      resolve();
    };
    
    script.onerror = (error) => {
      console.error('Failed to load PayPal SDK:', error);
      reject(new Error('Failed to load PayPal SDK'));
    };
    
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
  // Ensure PayPal SDK is loaded
  if (!window.paypal || !window.paypal.Buttons) {
    console.error('PayPal SDK not loaded or Buttons component missing');
    onError(new Error('PayPal SDK not loaded properly'));
    return;
  }

  // Clear existing buttons if any
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container #${containerId} not found`);
    return;
  }
  
  container.innerHTML = '';

  // Skip PayPal integration for free plan
  if (plan === 'free') {
    return;
  }

  // Get plan ID based on selected plan - always use monthly
  const planId = PAYPAL_PLAN_IDS[plan as keyof typeof PAYPAL_PLAN_IDS]?.monthly;
  if (!planId) {
    console.error(`No PayPal plan ID found for plan: ${plan} (monthly)`);
    onError(new Error(`Invalid plan selected: ${plan}`));
    return;
  }

  try {
    console.log(`Creating PayPal buttons for plan: ${plan}, ID: ${planId}`);
    
    // Create a specific container element for this instance
    const buttonContainer = document.createElement('div');
    buttonContainer.id = `paypal-button-${Date.now()}`;
    container.appendChild(buttonContainer);
    
    window.paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'subscribe'
      },
      createSubscription: function(data: any, actions: any) {
        console.log('Creating subscription with plan ID:', planId);
        return actions.subscription.create({
          /* Creates the subscription */
          plan_id: planId
        });
      },
      onApprove: function(data: any) {
        console.log('Subscription approved:', data);
        onApprove(data);
      },
      onError: function(err: any) {
        console.error('PayPal error:', err);
        onError(err);
      },
      onCancel: function() {
        console.log('Subscription canceled');
      }
    }).render(`#${buttonContainer.id}`);
    
    console.log(`PayPal button rendered to #${buttonContainer.id}`);
  } catch (error) {
    console.error('Error rendering PayPal buttons:', error);
    onError(error);
  }
};
