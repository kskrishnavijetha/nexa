
/**
 * Main PayPal service that re-exports functionality from submodules
 */
import { saveSubscription } from './subscriptionService';
import { loadPayPalScript } from './paypal/scriptLoader';
import { createPayPalButtons } from './paypal/buttonRenderer';
import { verifyLifetimePayment, processLifetimePaymentCompletion } from './paypal/lifetimeVerification';
import { PAYPAL_CLIENT_ID, PAYPAL_PLAN_IDS } from './paypal/config';
import type { PaymentResult } from './paymentProcessor';

// Re-export all the PayPal functionality
export {
  loadPayPalScript,
  createPayPalButtons,
  verifyLifetimePayment,
  processLifetimePaymentCompletion
};
