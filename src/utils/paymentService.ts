
/**
 * Main payment service module that re-exports from sub-modules
 */

import { isDemoMode, useDemoScan, getDemoConfig } from './demoMode';

// Export from subscriptionService
export {
  saveSubscription,
  getSubscription,
  hasActiveSubscription,
  hasScansRemaining,
  recordScanUsage,
  shouldUpgrade,
  shouldUpgradeTier,
  clearUserSubscription
} from './payment/subscriptionService';

// Export type separately to avoid TypeScript isolatedModules error
export type { SubscriptionInfo } from './payment/subscriptionService';

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

// Enhanced functions that consider demo mode
export const hasScansRemainingWithDemo = (userId?: string): boolean => {
  if (isDemoMode()) {
    const config = getDemoConfig();
    return config.scansRemaining > 0;
  }
  
  const subscription = require('./payment/subscriptionService').getSubscription(userId);
  return !!subscription && subscription.active && 
    (subscription.isLifetime || subscription.scansUsed < subscription.scansLimit);
};

export const recordScanUsageWithDemo = (userId?: string): void => {
  if (isDemoMode()) {
    useDemoScan();
    return;
  }
  
  require('./payment/subscriptionService').recordScanUsage(userId);
};

export const shouldUpgradeWithDemo = (userId?: string): boolean => {
  if (isDemoMode()) {
    const config = getDemoConfig();
    return config.scansRemaining === 0;
  }
  
  return require('./payment/subscriptionService').shouldUpgrade(userId);
};
