
/**
 * Payment and subscription type definitions
 */

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  expirationDate?: Date;
}

export interface SubscriptionInfo {
  active: boolean;
  plan: string;
  scansUsed: number;
  scansLimit: number;
  expirationDate: Date;
}

// Pricing tier definitions
export const pricingTiers = {
  free: { scans: 1, days: 30 },
  basic: { scans: 10, days: 30 },
  pro: { scans: 50, days: 30 },
  enterprise: { scans: 999, days: 30 }, // Using 999 to represent unlimited
};

// PayPal plan IDs - Replace with your actual plan IDs
export const PAYPAL_PLAN_IDS = {
  basic: 'P-9HD8411875146223CMUSBMCA',  // Example plan ID - update this with your actual plan ID
  pro: 'P-3NN72537D3262274CMUSBMDI',    // Example plan ID - update this with your actual plan ID
  enterprise: 'P-5GJ8318862350144UMUSBMEI'  // Example plan ID - update this with your actual plan ID
};

// PayPal client ID - Using your provided PayPal Client ID
export const PAYPAL_CLIENT_ID = 'AbjWpZd-uPzFyoPALjqopkA1ptAxkfpmqfYgirEXeXpprFfM-YlimFqVzVYJP_69pzxqCmxSv_RHY7P1';

// Type definitions for PayPal buttons
declare global {
  interface Window {
    paypal?: any;
  }
}
