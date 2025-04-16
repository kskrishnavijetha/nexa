
/**
 * Module for loading the PayPal SDK script
 */
import { PAYPAL_CLIENT_ID } from './config';

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
