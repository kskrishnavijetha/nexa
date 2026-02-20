/**
 * Main payment service module that re-exports from sub-modules
 */

export {
  saveSubscription,
  getSubscription,
  hasActiveSubscription,
  hasScansRemaining,
  recordScanUsage,
  shouldUpgrade,
  shouldUpgradeTier,
  clearUserSubscription,
  ensureFreePlan,
} from './payment/subscriptionService';

export type { SubscriptionInfo } from './payment/subscriptionService';

export {
  loadPayPalScript,
  createPayPalButtons
} from './payment/paypalService';

export {
  processOneTimePayment,
  createSubscription,
  fetchPaymentMethods
} from './payment/paymentProcessor';

export type { PaymentResult } from './payment/paymentProcessor';
