
import { SubscriptionInfo, pricingTiers } from './types';

/**
 * Subscription management functions
 */

// Store the user's current subscription in localStorage
export const saveSubscription = (plan: string, paymentId: string) => {
  const selectedTier = pricingTiers[plan as keyof typeof pricingTiers];
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + selectedTier.days);
  
  const subscription: SubscriptionInfo = {
    active: true,
    plan: plan,
    scansUsed: 0,
    scansLimit: selectedTier.scans,
    expirationDate: expirationDate
  };
  
  localStorage.setItem('subscription', JSON.stringify(subscription));
  return subscription;
};

// Get the current subscription from localStorage
export const getSubscription = (): SubscriptionInfo | null => {
  const subscription = localStorage.getItem('subscription');
  if (!subscription) {
    return null;
  }
  
  const parsedSubscription = JSON.parse(subscription);
  parsedSubscription.expirationDate = new Date(parsedSubscription.expirationDate);
  
  // Check if subscription is expired
  if (parsedSubscription.expirationDate < new Date()) {
    parsedSubscription.active = false;
  }
  
  return parsedSubscription;
};

// Check if user has an active subscription
export const hasActiveSubscription = (): boolean => {
  const subscription = getSubscription();
  return !!subscription && subscription.active;
};

// Check if user has scans remaining
export const hasScansRemaining = (): boolean => {
  const subscription = getSubscription();
  return !!subscription && subscription.active && subscription.scansUsed < subscription.scansLimit;
};

// Record a scan usage
export const recordScanUsage = (): void => {
  const subscription = getSubscription();
  if (subscription && subscription.active) {
    subscription.scansUsed += 1;
    localStorage.setItem('subscription', JSON.stringify(subscription));
  }
};

// Check if user should upgrade (free plan with all scans used)
export const shouldUpgrade = (): boolean => {
  const subscription = getSubscription();
  if (!subscription) return false;
  
  return subscription.active && 
         subscription.plan === 'free' && 
         subscription.scansUsed >= subscription.scansLimit;
};
