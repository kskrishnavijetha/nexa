
export interface Subscription {
  plan: string;
  subscriptionId: string;
  interval: string;
  scansLimit: number;
  scansUsed: number;
  isActive: boolean;
  expiresAt?: Date;
}

// Mock payment service functions for the current implementation
export const saveSubscription = (plan: string, subscriptionId: string, interval: string, userId: string) => {
  const subscription: Subscription = {
    plan,
    subscriptionId,
    interval,
    scansLimit: plan === 'free' ? 3 : plan === 'pro' ? 50 : 999,
    scansUsed: 0,
    isActive: true,
    expiresAt: plan === 'free' ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  };
  
  localStorage.setItem(`subscription_${userId}`, JSON.stringify(subscription));
  console.log('Subscription saved:', subscription);
};

export const getSubscription = (userId: string): Subscription | null => {
  const stored = localStorage.getItem(`subscription_${userId}`);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const shouldUpgrade = (userId: string): boolean => {
  const subscription = getSubscription(userId);
  if (!subscription) return true;
  
  // Check if subscription is expired or scans are exhausted
  const isExpired = subscription.expiresAt && new Date() > new Date(subscription.expiresAt);
  const scansExhausted = subscription.scansUsed >= subscription.scansLimit;
  
  return !subscription.isActive || isExpired || scansExhausted;
};

export const hasActiveSubscription = (userId: string): boolean => {
  const subscription = getSubscription(userId);
  if (!subscription) return false;
  
  const isExpired = subscription.expiresAt && new Date() > new Date(subscription.expiresAt);
  return subscription.isActive && !isExpired;
};

export const hasScansRemaining = (userId: string): boolean => {
  const subscription = getSubscription(userId);
  if (!subscription) return false;
  
  return subscription.scansUsed < subscription.scansLimit;
};

export const clearUserSubscription = (userId: string): void => {
  localStorage.removeItem(`subscription_${userId}`);
  console.log('User subscription cleared');
};
