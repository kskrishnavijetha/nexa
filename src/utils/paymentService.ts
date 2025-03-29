
/**
 * Main payment service module that re-exports from sub-modules
 */

// Export from subscriptionService
export {
  SubscriptionInfo,
  saveSubscription,
  getSubscription,
  hasActiveSubscription,
  hasScansRemaining,
  recordScanUsage
} from './payment/subscriptionService';

// Export from paypalService
export {
  loadPayPalScript,
  createPayPalButtons
} from './payment/paypalService';

// Export from paymentProcessor
export {
  PaymentResult,
  processOneTimePayment,
  createSubscription,
  fetchPaymentMethods
} from './payment/paymentProcessor';
