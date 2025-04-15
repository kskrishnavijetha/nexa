
/**
 * Type definitions for PayPal integration
 */

// Type definitions for PayPal
declare global {
  interface Window {
    paypal?: any;
  }
}

export interface PayPalPlanIds {
  [key: string]: {
    monthly: string;
    annually?: string;
  };
}

export interface PayPalButtonOptions {
  containerId: string;
  plan: string;
  billingCycle: 'monthly' | 'annually';
  onApprove: (data: any) => void;
  onError: (err: any) => void;
}
