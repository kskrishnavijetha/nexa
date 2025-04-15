
/**
 * Main payment service module that re-exports from sub-modules
 */

// Export from subscription service
export {
  saveSubscription,
  getSubscription,
  hasActiveSubscription,
  hasScansRemaining,
  recordScanUsage,
  shouldUpgrade,
  shouldUpgradeTier
} from './payment/subscription';

// Export type separately to avoid TypeScript isolatedModules error
export type { SubscriptionInfo } from './payment/subscription';

// Export from paypalService
export {
  loadPayPalScript,
  createPayPalButtons
} from './payment/paypalService';

// Export from paymentProcessor
export {
  processOneTimePayment,
  createSubscription,
  fetchPaymentMethods
} from './payment/paymentProcessor';

// Export type separately to avoid TypeScript isolatedModules error
export type { PaymentResult } from './payment/paymentProcessor';
