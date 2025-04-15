
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
 * Clean up any existing PayPal scripts
 */
const cleanupExistingScripts = () => {
  const existingScripts = document.querySelectorAll('script[src*="paypal.com/sdk/js"]');
  existingScripts.forEach(script => {
    document.body.removeChild(script);
  });
};

/**
 * Load PayPal SDK
 */
export const loadPayPalScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already loaded, just resolve
    if (window.paypal) {
      console.log('PayPal SDK already loaded');
      resolve();
      return;
    }
    
    // Clean up any existing script tags to prevent conflicts
    cleanupExistingScripts();

    const script = document.createElement('script');
    const currentUrl = window.location.href.split('?')[0]; 
    const returnUrl = currentUrl.endsWith('/') ? `${currentUrl}payment` : `${currentUrl}/payment`;
    
    // Enable card funding sources explicitly
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=subscription&vault=true&enable-funding=card,credit,venmo`;
    script.async = true;
    
    // Add timeout to catch loading issues
    const timeoutId = setTimeout(() => {
      console.error('PayPal SDK loading timed out');
      reject(new Error('Failed to load PayPal SDK: timeout'));
    }, 10000);
    
    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
      clearTimeout(timeoutId);
      resolve();
    };
    
    script.onerror = (error) => {
      console.error('Error loading PayPal SDK:', error);
      clearTimeout(timeoutId);
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

/**
 * Verify lifetime payment by PayPal transaction ID
 * In a real implementation, this would verify with a backend API
 * For now, we'll simulate a successful verification
 */
export const verifyLifetimePayment = async (transactionId: string): Promise<boolean> => {
  console.log('Verifying lifetime payment with transaction ID:', transactionId);
  
  // In a real implementation, you would call your backend to verify the payment
  // For demo purposes, we'll simulate a successful payment verification
  // Wait 1 second to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For this demo, we'll consider any transaction ID that starts with 'YF' as verified
  // In a real implementation, you'd check against actual PayPal transactions
  return transactionId.startsWith('YF');
};

/**
 * Process lifetime payment completion
 */
export const processLifetimePaymentCompletion = async (): Promise<{success: boolean, message: string}> => {
  // Extract transaction ID from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const txnId = urlParams.get('txnId') || urlParams.get('txn_id');
  
  if (!txnId) {
    return {
      success: false,
      message: 'No transaction ID found. Payment verification failed.'
    };
  }
  
  try {
    // Verify the payment
    const isVerified = await verifyLifetimePayment(txnId);
    
    if (isVerified) {
      // Since lifetime plan has been removed, handle this as a generic payment success
      // or redirect to regular subscription plans
      console.log('Lifetime plan no longer offered, treating as regular payment');
      
      return {
        success: true,
        message: 'Payment verified successfully! Please select a subscription plan.'
      };
    } else {
      return {
        success: false,
        message: 'Payment verification failed. Please contact support.'
      };
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      message: 'An error occurred while processing your payment. Please contact support.'
    };
  }
};

