
/**
 * Service for managing user subscriptions
 */

export interface SubscriptionInfo {
  active: boolean;
  plan: string;
  scansUsed: number;
  scansLimit: number;
  expirationDate: Date;
  billingCycle?: 'monthly' | 'annually' | 'lifetime';
  userId?: string; // Add userId to track which user the subscription belongs to
  isLifetime?: boolean; // Flag to identify lifetime subscriptions
}

// Store the user's current subscription in localStorage with userId
export const saveSubscription = (plan: string, paymentId: string, billingCycle: 'monthly' | 'annually' | 'lifetime' = 'monthly', userId?: string) => {
  const pricingTiers = {
    free: { scans: 5, days: 30 }, // 5 scans per month
    starter: { scans: 20, days: 30 },
    pro: { scans: 999, days: 30 }, // Using 999 to represent unlimited
    enterprise: { scans: 999, days: 30 }, // Using 999 to represent unlimited
    lifetime: { scans: 9999, days: 3650 } // 10 years (effectively lifetime)
  };
  
  const selectedTier = pricingTiers[plan as keyof typeof pricingTiers] || pricingTiers.starter;
  const expirationDate = new Date();
  
  // For free plan, set expiration to 30 days from now and ensure it's active
  if (plan === 'free') {
    expirationDate.setDate(expirationDate.getDate() + 30);
  } else {
    expirationDate.setDate(expirationDate.getDate() + selectedTier.days);
  }
  
  const subscription: SubscriptionInfo = {
    active: true, // Always start as active for new subscriptions
    plan: plan,
    scansUsed: 0, // Always start with 0 scans used
    scansLimit: selectedTier.scans,
    expirationDate: expirationDate,
    billingCycle: billingCycle,
    userId: userId, // Store the user ID with the subscription
    isLifetime: billingCycle === 'lifetime'
  };
  
  // Store subscription with user ID in the key if available
  const storageKey = userId ? `subscription_${userId}` : 'subscription';
  localStorage.setItem(storageKey, JSON.stringify(subscription));
  
  console.log('Subscription saved:', subscription);
  return subscription;
};

// Get the current subscription from localStorage for the current user
export const getSubscription = (userId?: string): SubscriptionInfo | null => {
  // Try to get user-specific subscription first if userId provided
  if (userId) {
    const userSubscription = localStorage.getItem(`subscription_${userId}`);
    if (userSubscription) {
      const parsedSubscription = JSON.parse(userSubscription);
      parsedSubscription.expirationDate = new Date(parsedSubscription.expirationDate);
      
      // Check if subscription is expired (but not for lifetime subscriptions)
      if (!parsedSubscription.isLifetime && parsedSubscription.expirationDate < new Date()) {
        parsedSubscription.active = false;
      }
      
      return parsedSubscription;
    }
  }
  
  // Fall back to the generic subscription if no user-specific one found
  const subscription = localStorage.getItem('subscription');
  if (!subscription) {
    return null;
  }
  
  const parsedSubscription = JSON.parse(subscription);
  parsedSubscription.expirationDate = new Date(parsedSubscription.expirationDate);
  
  // Check if subscription is expired (but not for lifetime subscriptions)
  if (!parsedSubscription.isLifetime && parsedSubscription.expirationDate < new Date()) {
    parsedSubscription.active = false;
  }
  
  // If we have a userId but no user-specific subscription,
  // migrate this subscription to be user-specific
  if (userId && !parsedSubscription.userId) {
    parsedSubscription.userId = userId;
    localStorage.setItem(`subscription_${userId}`, JSON.stringify(parsedSubscription));
  }
  
  return parsedSubscription;
};

// Check if user has an active subscription
export const hasActiveSubscription = (userId?: string): boolean => {
  const subscription = getSubscription(userId);
  return !!subscription && subscription.active;
};

// Check if user has scans remaining
export const hasScansRemaining = (userId?: string): boolean => {
  const subscription = getSubscription(userId);
  return !!subscription && subscription.active && 
    (subscription.isLifetime || subscription.scansUsed < subscription.scansLimit);
};

// Record a scan usage - MODIFIED to properly increment usage count
export const recordScanUsage = (userId?: string): void => {
  const subscription = getSubscription(userId);
  if (subscription && subscription.active) {
    // Don't count usage for lifetime subscriptions
    if (subscription.isLifetime) {
      console.log('Lifetime plan: scan usage not counted');
      return;
    }
    
    // Increment usage count
    subscription.scansUsed += 1;
    console.log(`Recording scan: now used ${subscription.scansUsed} of ${subscription.scansLimit} scans`);
    
    // Check if scans limit reached
    if (subscription.scansUsed >= subscription.scansLimit) {
      // Mark as inactive if scans are exhausted
      if (subscription.plan === 'free') {
        subscription.active = false;
        console.log('Free plan scans exhausted, marking as inactive');
      } else {
        console.log('Paid plan scans exhausted, keeping active but should show upgrade message');
      }
    }
    
    // Store with user ID if available
    const storageKey = userId || subscription.userId 
      ? `subscription_${userId || subscription.userId}` 
      : 'subscription';
    
    localStorage.setItem(storageKey, JSON.stringify(subscription));
  } else {
    console.log('No active subscription found to record scan usage');
  }
};

// Check if user needs to upgrade (free plan with no scans left or expired)
export const shouldUpgrade = (userId?: string): boolean => {
  const subscription = getSubscription(userId);
  
  if (!subscription) {
    return false; // No subscription yet, they'll be directed to pricing anyway
  }
  
  // Lifetime subscriptions never need to upgrade
  if (subscription.isLifetime) {
    return false;
  }
  
  // If subscription has expired or no scans left
  const needsUpgrade = (!subscription.active || 
    subscription.scansUsed >= subscription.scansLimit);
  
  if (needsUpgrade) {
    console.log('User needs to upgrade: active=', subscription.active, 
      'scans used=', subscription.scansUsed, 
      'scans limit=', subscription.scansLimit);
  }
  
  return needsUpgrade;
};

// Check if user needs to upgrade specifically to a higher tier than they currently have
export const shouldUpgradeTier = (userId?: string): boolean => {
  const subscription = getSubscription(userId);
  
  if (!subscription) {
    // If no subscription exists, user doesn't need to upgrade yet - they need to select a plan first
    return false;
  }
  
  // Lifetime subscriptions never need to upgrade tier
  if (subscription.isLifetime) {
    return false;
  }
  
  // Check if scans limit reached and not on enterprise plan
  // For free plan, only return true if active is false (meaning they've used all scans)
  if (subscription.plan === 'free') {
    const needsUpgrade = subscription.scansUsed >= subscription.scansLimit;
    if (needsUpgrade) {
      console.log('Free user needs to upgrade: scans used=', subscription.scansUsed, 
        'scans limit=', subscription.scansLimit);
    }
    return needsUpgrade;
  }
  
  const needsUpgradeTier = (
    subscription.scansUsed >= subscription.scansLimit && 
    subscription.plan !== 'enterprise' && 
    subscription.plan !== 'pro'
  );
  
  if (needsUpgradeTier) {
    console.log('Paid user needs to upgrade tier: plan=', subscription.plan,
      'scans used=', subscription.scansUsed, 
      'scans limit=', subscription.scansLimit);
  }
  
  return needsUpgradeTier;
};

// DO NOT clear user-specific subscription data when user logs out
// This is important to maintain subscription data across sessions
export const clearUserSubscription = (userId: string): void => {
  // Do nothing - we want to keep subscription data across sessions
  console.log('Subscription data preserved across sessions for user', userId);
};
