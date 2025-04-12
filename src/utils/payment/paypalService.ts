
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
 * Clean up any existing PayPal script from the page
 */
const cleanupExistingPayPalScript = (): void => {
  const existingScript = document.querySelector('script[src*="www.paypal.com/sdk/js"]');
  if (existingScript && existingScript.parentNode) {
    existingScript.parentNode.removeChild(existingScript);
    // Reset the global PayPal object
    window.paypal = undefined;
  }
};

/**
 * Load PayPal SDK with retry mechanism
 */
export const loadPayPalScript = (maxRetries = 2): Promise<void> => {
  cleanupExistingPayPalScript();
  
  return new Promise((resolve, reject) => {
    // If PayPal is already loaded correctly, resolve immediately
    if (window.paypal) {
      resolve();
      return;
    }
    
    let retries = 0;
    
    const loadScript = () => {
      const script = document.createElement('script');
      const currentUrl = window.location.href.split('?')[0]; // Remove any query parameters
      const returnUrl = currentUrl.endsWith('/') ? `${currentUrl}payment` : `${currentUrl}/payment`;
      
      // Critical: Include all necessary parameters for card payments
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=subscription&components=buttons&enable-funding=card,credit,venmo`;
      script.async = true;
      
      // Handle script loading success
      script.onload = () => {
        console.log('PayPal script loaded successfully');
        if (window.paypal) {
          resolve();
        } else {
          console.error('PayPal script loaded but global paypal object not initialized');
          if (retries < maxRetries) {
            retries++;
            console.log(`Retrying PayPal script load (${retries}/${maxRetries})...`);
            setTimeout(loadScript, 1500);
          } else {
            reject(new Error('Failed to initialize PayPal SDK after multiple attempts'));
          }
        }
      };
      
      // Handle script loading error
      script.onerror = (error) => {
        console.error('Error loading PayPal script:', error);
        if (retries < maxRetries) {
          retries++;
          console.log(`Retrying PayPal script load (${retries}/${maxRetries})...`);
          setTimeout(loadScript, 1500);
        } else {
          reject(new Error('Failed to load PayPal SDK after multiple attempts'));
        }
      };
      
      document.body.appendChild(script);
    };
    
    // Set a timeout for script loading
    const timeout = setTimeout(() => {
      if (!window.paypal) {
        reject(new Error('Timed out waiting for PayPal SDK to load'));
      }
    }, 10000); // 10 second timeout
    
    // Start loading the script
    loadScript();
    
    // Clean up timeout on success
    const originalResolve = resolve;
    resolve = (() => {
      clearTimeout(timeout);
      originalResolve();
    }) as any;
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
      fundingSource: window.paypal.FUNDING.PAYPAL,
      createSubscription: function(data: any, actions: any) {
        console.log('Creating subscription with plan ID:', planId);
        return actions.subscription.create({
          plan_id: planId,
          application_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: appBasePath,
            cancel_url: appBasePath,
            brand_name: 'ComplianceGuard',
            no_shipping: 1,
            // Set landing page to login to force authentication
            landing_page: 'LOGIN'
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
    
    // Also render card payment button
    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'silver', // Use different color for card button
        shape: 'rect',
        label: 'card'
      },
      fundingSource: window.paypal.FUNDING.CARD,
      createSubscription: function(data: any, actions: any) {
        console.log('Creating card subscription with plan ID:', planId);
        return actions.subscription.create({
          plan_id: planId,
          application_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: appBasePath,
            cancel_url: appBasePath,
            brand_name: 'ComplianceGuard',
            no_shipping: 1,
            // Set landing page to login to force authentication
            landing_page: 'LOGIN'
          }
        });
      },
      onApprove: function(data: any, actions: any) {
        console.log('Card subscription approved:', data);
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
        console.error('Card payment error:', err);
        onError(err);
      }
    }).render(`#${containerId}`);
    
    console.log(`PayPal buttons rendered in #${containerId}`);
  } catch (error) {
    console.error('Error rendering PayPal buttons:', error);
    onError(error);
  }
};
