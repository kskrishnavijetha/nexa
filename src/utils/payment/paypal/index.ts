
/**
 * Main exports for PayPal services
 */

export { loadPayPalScript } from './scriptLoader';
export { createPayPalButtons } from './buttonRenderer';
export { verifyLifetimePayment, processLifetimePaymentCompletion } from './lifetimePayment';
export { PAYPAL_CLIENT_ID, PAYPAL_PLAN_IDS } from './config';
export type { PayPalButtonOptions, PayPalPlanIds } from './types';
