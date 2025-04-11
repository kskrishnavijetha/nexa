
/**
 * PayPal SDK loading service
 */

// Track the SDK loading state
let paypalSDKLoaded = false;
let paypalSDKLoading = false;
let loadCallbacks: Array<{ resolve: () => void, reject: (error: Error) => void }> = [];

// PayPal client ID - Replace with your actual PayPal client ID
const PAYPAL_CLIENT_ID = 'AXKd2EHw7ySZihlaN06rqnABzzQdhD8ueu738V8iCtC93o8PwlZdjO7hwVITJgTsmjOq8dHJaC1vMMKT';

// Type definitions for PayPal
declare global {
  interface Window {
    paypal?: any;
  }
}

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
    // First check if PayPal script is already loaded
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
      // Remove any existing script to avoid conflicts
      const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
        paypalSDKLoaded = false;
        console.log('Removed existing PayPal script');
      }
      
      // Create new script element
      const script = document.createElement('script');
      
      // Use currency=USD and intent=subscription with buttons component
      // Add debug=true to help with troubleshooting
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=subscription&components=buttons&disable-funding=credit,card&debug=true`;
      script.async = true;
      
      script.onload = () => {
        console.log('PayPal SDK loaded successfully');
        
        // Add a small delay to ensure PayPal is fully initialized
        setTimeout(() => {
          paypalSDKLoaded = true;
          paypalSDKLoading = false;
          
          // Resolve this promise
          resolve();
          
          // Resolve any queued promises
          loadCallbacks.forEach(callback => callback.resolve());
          loadCallbacks = [];
          
          console.log('PayPal initialization complete, SDK ready to use');
        }, 1000); // Increase timeout to 1000ms to ensure proper initialization
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
