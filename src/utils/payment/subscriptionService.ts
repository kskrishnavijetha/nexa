
/**
 * Mock subscription service implementation
 * In a real app, this would be integrated with a real payment provider
 */

import { toast } from 'sonner';

export interface SubscriptionInfo {
  id: string;
  userId: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt: string;
  scansRemaining: number;
  maxScans: number;
  autoRenew: boolean;
  customerId?: string;
}

// In-memory store for subscriptions (in a real app, this would be in a database)
const subscriptions: Record<string, SubscriptionInfo> = {};

/**
 * Check if a user should upgrade (has reached free usage limits)
 */
export const shouldUpgrade = (userId?: string | null): boolean => {
  if (!userId) return false;
  
  const subscription = getSubscription(userId);
  
  // If no subscription exists, the user is on the free plan and should upgrade
  if (!subscription) {
    return false; // No subscription yet, user is just starting
  }
  
  // If the user's subscription has expired, they should upgrade
  if (subscription.status === 'expired') {
    return true;
  }
  
  // If the user has used all their scans, they should upgrade
  if (subscription.plan === 'free' && subscription.scansRemaining <= 0) {
    return true;
  }
  
  return false;
};

/**
 * Create or update a subscription for a user
 */
export const saveSubscription = (
  userId: string,
  plan: 'free' | 'basic' | 'premium' | 'enterprise',
  status: 'active' | 'cancelled' | 'expired' = 'active',
  customerId?: string
): SubscriptionInfo => {
  // Set scans based on plan
  const maxScans = 
    plan === 'free' ? 5 : 
    plan === 'basic' ? 50 : 
    plan === 'premium' ? 500 : 
    Infinity;
  
  // Calculate expiration (30 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  // Create or update subscription
  const subscription: SubscriptionInfo = {
    id: subscriptions[userId]?.id || `sub_${Math.random().toString(36).substring(2, 15)}`,
    userId,
    plan,
    status,
    expiresAt: expiresAt.toISOString(),
    scansRemaining: maxScans,
    maxScans,
    autoRenew: plan !== 'free',
    customerId
  };
  
  subscriptions[userId] = subscription;
  
  console.log(`Subscription saved for user ${userId}:`, subscription);
  return subscription;
};

/**
 * Get a user's subscription information
 */
export const getSubscription = (userId?: string | null): SubscriptionInfo | null => {
  if (!userId) return null;
  
  // If user doesn't have a subscription yet, create a free one
  if (!subscriptions[userId]) {
    return saveSubscription(userId, 'free');
  }
  
  return subscriptions[userId];
};

/**
 * Check if a user has an active subscription
 */
export const hasActiveSubscription = (userId?: string | null): boolean => {
  if (!userId) return false;
  
  const subscription = getSubscription(userId);
  if (!subscription) return false;
  
  return subscription.status === 'active';
};

/**
 * Check if a user has any scans remaining in their subscription
 */
export const hasScansRemaining = (userId?: string | null): boolean => {
  if (!userId) return false;
  
  const subscription = getSubscription(userId);
  if (!subscription) return false;
  
  return subscription.scansRemaining > 0;
};

/**
 * Record usage of a scan, decrementing the scans remaining
 */
export const recordScanUsage = (userId?: string | null): boolean => {
  if (!userId) return false;
  
  const subscription = getSubscription(userId);
  if (!subscription) return false;
  
  if (subscription.scansRemaining <= 0) {
    toast.error('You have no scans remaining. Please upgrade your plan.');
    return false;
  }
  
  subscription.scansRemaining--;
  console.log(`Recorded scan usage for ${userId}. Remaining: ${subscription.scansRemaining}`);
  
  // Show a warning when running low on scans
  if (subscription.plan === 'free' && subscription.scansRemaining <= 1) {
    toast.warning(`You have ${subscription.scansRemaining} scan${subscription.scansRemaining === 1 ? '' : 's'} remaining on your free plan.`);
  }
  
  return true;
};
