
/**
 * Main subscription service exports
 */
export {
  saveSubscription,
  getSubscription,
  hasActiveSubscription,
  hasScansRemaining,
  recordScanUsage,
  shouldUpgrade,
  shouldUpgradeTier
} from './subscriptionManager';

export type { SubscriptionInfo } from './types';
