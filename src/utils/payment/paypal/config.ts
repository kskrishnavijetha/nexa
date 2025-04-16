/**
 * PayPal configuration and plan IDs
 */

// PayPal client ID - Replace with your actual PayPal client ID
export const PAYPAL_CLIENT_ID = 'AXKd2EHw7ySZihlaN06rqnABzzQdhD8ueu738V8iCtC93o8PwlZdjO7hwVITJgTsmjOq8dHJaC1vMMKT';

// PayPal plan IDs for different subscription tiers
export const PAYPAL_PLAN_IDS = {
  starter: {
    monthly: 'P-7JU242559V237791XM77STDA'  // Starter plan ID
  },
  pro: {
    monthly: 'P-45M40490U9458232TM77SULI'  // Updated Pro plan ID
  },
  enterprise: {
    monthly: 'P-1TN86124MG006482VM77SVJA'  // Updated Enterprise plan ID
  }
};

// Type definitions for PayPal
declare global {
  interface Window {
    paypal?: any;
  }
}
