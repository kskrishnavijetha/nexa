
import { PAYPAL_CLIENT_ID, PAYPAL_PLAN_IDS, DEV_MODE } from './types';
import { saveSubscription } from './subscriptionService';

/**
 * Load PayPal SDK
 */
export const loadPayPalScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // In development mode, we'll just simulate the PayPal SDK loading
    if (DEV_MODE) {
      console.log('DEV MODE: Simulating PayPal SDK loading');
      
      // Mock the PayPal object for development
      if (!window.paypal) {
        window.paypal = {
          Buttons: () => ({
            render: () => {
              console.log('DEV MODE: Rendering mock PayPal button');
              
              // Add a visual indication in the DOM that this is a mock button
              const container = document.getElementById('paypal-button-container');
              if (container) {
                // Create mock button in dev mode
                const mockButton = document.createElement('button');
                mockButton.className = 'w-full px-4 py-2 bg-blue-500 text-white rounded';
                mockButton.textContent = 'DEV MODE - PayPal Checkout';
                mockButton.onclick = () => {
                  console.log('DEV MODE: Mock PayPal button clicked');
                  const plan = container.getAttribute('data-plan') || 'basic';
                  
                  // Simulate successful subscription for this plan
                  const mockSubscriptionID = 'mock_sub_' + Math.random().toString(36).substring(2, 15);
                  
                  // Save the subscription using our processor
                  saveSubscription(plan, mockSubscriptionID);
                  
                  // Call the onApprove callback that would be set by createPayPalButtons
                  const onApproveScript = container.getAttribute('data-on-approve');
                  if (onApproveScript) {
                    try {
                      const onApproveFn = new Function('data', onApproveScript);
                      onApproveFn({ subscriptionID: mockSubscriptionID });
                    } catch (error) {
                      console.error('Error executing onApprove script:', error);
                    }
                  }
                };
                
                container.innerHTML = '';
                container.appendChild(mockButton);
              }
              
              return { close: () => {} };
            }
          })
        };
      }
      
      // Resolve immediately
      setTimeout(resolve, 500);
      return;
    }

    // Real implementation for production mode
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
    
    // Store the plan and onApprove callback for dev mode mock button
    if (DEV_MODE) {
      container.setAttribute('data-plan', plan);
      container.setAttribute('data-on-approve', `return ${onApprove.toString()}(data);`);
    }
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
        if (DEV_MODE) {
          console.log(`DEV MODE: Would create subscription for plan ID: ${planId}`);
          return Promise.resolve('mock_sub_id');
        }
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
