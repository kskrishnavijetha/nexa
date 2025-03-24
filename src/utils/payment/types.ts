
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

// PayPal plan IDs
export const PAYPAL_PLAN_IDS = {
  basic: 'P-1YE78369FA595372FM7QORFY',  // Updated with actual Basic plan ID
  pro: 'P-3NN72537D3262274CMUSBMDI',    // Example plan ID - update this with actual plan ID
  enterprise: 'P-5GJ8318862350144UMUSBMEI'  // Example plan ID - update this with actual plan ID
};

// PayPal client ID
export const PAYPAL_CLIENT_ID = 'AbjWpZd-uPzFyoPALjqopkA1ptAxkfpmqfYgirEXeXpprFfM-YlimFqVzVYJP_69pzxqCmxSv_RHY7P1';

// Development mode flag - always true for now to ensure app stays in development mode
export const DEV_MODE = true;

// Declare global types for PayPal
declare global {
  interface Window {
    paypal?: any;
  }
}
