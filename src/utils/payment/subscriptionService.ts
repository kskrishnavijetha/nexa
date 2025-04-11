
/**
 * Service for managing user subscriptions
 */

export interface SubscriptionInfo {
  active: boolean;
  plan: string;
  scansUsed: number;
  scansLimit: number;
  expirationDate: Date;
  billingCycle?: 'monthly' | 'annually';
}

// Store the user's current subscription in localStorage
export const saveSubscription = (plan: string, paymentId: string, billingCycle: 'monthly' | 'annually' = 'monthly') => {
  const pricingTiers = {
    free: { scans: 1, days: 30 },
    basic: { scans: 10, days: 30 },
    pro: { scans: 50, days: 30 },
    enterprise: { scans: 999, days: 30 }, // Using 999 to represent unlimited
  };
  
  const selectedTier = pricingTiers[plan as keyof typeof pricingTiers];
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + selectedTier.days);
  
  const subscription: SubscriptionInfo = {
    active: true,
    plan: plan,
    scansUsed: 0,
    scansLimit: selectedTier.scans,
    expirationDate: expirationDate,
    billingCycle: billingCycle
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
    
    // Check if scans limit reached
    if (subscription.scansUsed >= subscription.scansLimit) {
      // Mark as inactive if scan limit reached (for all plans)
      subscription.active = false;
    }
    
    localStorage.setItem('subscription', JSON.stringify(subscription));
  }
};

// Check if user needs to upgrade (subscription expired or scan limit reached)
export const shouldUpgrade = (): boolean => {
  const subscription = getSubscription();
  
  if (!subscription) {
    return true; // No subscription, needs to select a plan
  }
  
  // Return true if subscription is not active (expired or scan limit reached)
  return !subscription.active;
};

// Get scans remaining count
export const getScansRemaining = (): number => {
  const subscription = getSubscription();
  if (!subscription || !subscription.active) {
    return 0;
  }
  
  return Math.max(0, subscription.scansLimit - subscription.scansUsed);
};

// Check if user has reached scan limit
export const hasScanLimitReached = (): boolean => {
  const subscription = getSubscription();
  return !!subscription && subscription.scansUsed >= subscription.scansLimit;
};
