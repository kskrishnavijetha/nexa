
// Re-export everything from the main paymentService for backward compatibility
export {
  saveSubscription,
  getSubscription,
  hasActiveSubscription,
  hasScansRemaining,
  recordScanUsage,
  shouldUpgrade,
  shouldUpgradeTier,
  clearUserSubscription,
  type Subscription,
  type SubscriptionInfo
} from '../paymentService';
