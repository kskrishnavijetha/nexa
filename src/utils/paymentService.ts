
export interface Subscription {
  plan: string;
  subscriptionId: string;
  interval: string;
  scansLimit: number;
  scansUsed: number;
  isActive: boolean;
  active: boolean; // Legacy property for backward compatibility
  expiresAt?: Date;
  expirationDate?: Date; // Add this property for backward compatibility
  isLifetime?: boolean;
  billingCycle?: string;
}

// Legacy type alias for backward compatibility
export type SubscriptionInfo = Subscription;

// Mock payment service functions for the current implementation
export const saveSubscription = (plan: string, subscriptionId: string, interval: string, userId?: string) => {
  const subscription: Subscription = {
    plan,
    subscriptionId,
    interval,
    scansLimit: plan === 'free' ? 3 : plan === 'starter' ? 20 : plan === 'pro' ? 50 : 999,
    scansUsed: 0,
    isActive: true,
    active: true, // Legacy property
    expiresAt: plan === 'free' ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    expirationDate: plan === 'free' ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // For backward compatibility
    isLifetime: false,
    billingCycle: interval
  };
  
  const storageKey = userId ? `subscription_${userId}` : 'subscription';
  localStorage.setItem(storageKey, JSON.stringify(subscription));
  console.log('Subscription saved:', subscription);
};

export const getSubscription = (userId?: string): Subscription | null => {
  const storageKey = userId ? `subscription_${userId}` : 'subscription';
  const stored = localStorage.getItem(storageKey);
  if (!stored) return null;
  
  try {
    const subscription = JSON.parse(stored);
    // Ensure backward compatibility
    if (subscription && typeof subscription.active === 'undefined') {
      subscription.active = subscription.isActive;
    }
    if (subscription && !subscription.expirationDate && subscription.expiresAt) {
      subscription.expirationDate = subscription.expiresAt;
    }
    return subscription;
  } catch {
    return null;
  }
};

export const shouldUpgrade = (userId?: string): boolean => {
  const subscription = getSubscription(userId);
  if (!subscription) return true;
  
  // Check if subscription is expired or scans are exhausted
  const isExpired = subscription.expiresAt && new Date() > new Date(subscription.expiresAt);
  const scansExhausted = subscription.scansUsed >= subscription.scansLimit;
  
  return !subscription.isActive || isExpired || scansExhausted;
};

// Alias for shouldUpgrade for backward compatibility
export const shouldUpgradeTier = shouldUpgrade;

export const hasActiveSubscription = (userId?: string): boolean => {
  const subscription = getSubscription(userId);
  if (!subscription) return false;
  
  const isExpired = subscription.expiresAt && new Date() > new Date(subscription.expiresAt);
  return subscription.isActive && !isExpired;
};

export const hasScansRemaining = (userId?: string): boolean => {
  const subscription = getSubscription(userId);
  if (!subscription) return false;
  
  return subscription.scansUsed < subscription.scansLimit;
};

export const recordScanUsage = (userId?: string): boolean => {
  const subscription = getSubscription(userId);
  if (!subscription) return false;
  
  if (subscription.scansUsed >= subscription.scansLimit) {
    return false; // No scans remaining
  }
  
  subscription.scansUsed += 1;
  const storageKey = userId ? `subscription_${userId}` : 'subscription';
  localStorage.setItem(storageKey, JSON.stringify(subscription));
  console.log('Scan usage recorded. Used:', subscription.scansUsed, 'Limit:', subscription.scansLimit);
  
  return true;
};

export const clearUserSubscription = (userId?: string): void => {
  const storageKey = userId ? `subscription_${userId}` : 'subscription';
  localStorage.removeItem(storageKey);
  console.log('User subscription cleared');
};
