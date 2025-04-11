
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

// Track the SDK loading state
let paypalSDKLoaded = false;
let paypalSDKLoading = false;
let loadCallbacks: Array<{ resolve: () => void, reject: (error: Error) => void }> = [];

/**
 * Check if PayPal SDK is loaded
 */
export const isPayPalSDKLoaded = (): boolean => {
  return paypalSDKLoaded && window.paypal !== undefined;
};

/**
 * Load PayPal SDK
 */
export const loadPayPalScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // First, remove any existing PayPal script to avoid conflicts
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      document.body.removeChild(existingScript);
      paypalSDKLoaded = false;
      console.log('Removed existing PayPal script');
    }

    // Check if PayPal script is already loaded
    if (isPayPalSDKLoaded()) {
      console.log('PayPal SDK already loaded, resolving immediately');
      resolve();
      return;
    }
    
    // If already loading, add to callback queue
    if (paypalSDKLoading) {
      console.log('PayPal SDK already loading, adding to queue');
      loadCallbacks.push({ resolve, reject });
      return;
    }
    
    paypalSDKLoading = true;
    console.log('Loading PayPal SDK...');
    
    try {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=subscription&components=buttons&disable-funding=credit,card&debug=true`;
      script.async = true;
      
      script.onload = () => {
        console.log('PayPal SDK loaded successfully');
        paypalSDKLoaded = true;
        paypalSDKLoading = false;
        
        // Add a small delay to ensure PayPal is fully initialized
        setTimeout(() => {
          // Resolve this promise
          resolve();
          
          // Resolve any queued promises
          loadCallbacks.forEach(callback => callback.resolve());
          loadCallbacks = [];
        }, 500);
      };
      
      script.onerror = (error) => {
        console.error('Failed to load PayPal SDK:', error);
        paypalSDKLoading = false;
        
        // Reject this promise
        reject(new Error('Failed to load PayPal SDK'));
        
        // Reject any queued promises
        loadCallbacks.forEach(callback => 
          callback.reject(new Error('Failed to load PayPal SDK'))
        );
        loadCallbacks = [];
      };
      
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error creating PayPal script tag:', error);
      paypalSDKLoading = false;
      reject(new Error(`Failed to create PayPal script tag: ${error}`));
    }
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
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Ensure PayPal SDK is loaded
    if (!isPayPalSDKLoaded()) {
      console.error('PayPal SDK not loaded when trying to create buttons');
      onError(new Error('PayPal SDK not loaded'));
      resolve(false);
      return;
    }

    // Clear existing buttons if any
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      onError(new Error(`Container with ID ${containerId} not found`));
      resolve(false);
      return;
    }
    
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
