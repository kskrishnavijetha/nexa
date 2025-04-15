
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
    free: { scans: 5, days: 30 },
    basic: { scans: 15, days: 30 },
    pro: { scans: 50, days: 30 },
    enterprise: { scans: 999, days: 30 }, // Using 999 to represent unlimited
  };
  
  const selectedTier = pricingTiers[plan as keyof typeof pricingTiers] || pricingTiers.basic;
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
  return !!subscription && subscription.active && 
    subscription.scansUsed < subscription.scansLimit;
};

// Record a scan usage
export const recordScanUsage = (): void => {
  const subscription = getSubscription();
  if (subscription && subscription.active) {
    subscription.scansUsed += 1;
    
    // Check if scans limit reached
    if (subscription.scansUsed >= subscription.scansLimit) {
      // Mark as inactive if it's a free plan and limit reached
      if (subscription.plan === 'free') {
        subscription.active = false;
      }
    }
    
    localStorage.setItem('subscription', JSON.stringify(subscription));
  }
};

// Check if user needs to upgrade (free plan with no scans left or expired)
export const shouldUpgrade = (): boolean => {
  const subscription = getSubscription();
  
  if (!subscription) {
    return false; // No subscription yet, they'll be directed to pricing anyway
  }
  
  // If subscription has expired or no scans left
  return (
    !subscription.active || 
    subscription.scansUsed >= subscription.scansLimit
  );
};

// Check if user needs to upgrade specifically to a higher tier than they currently have
// Note: This function is fixed to properly handle new users and free tier users
export const shouldUpgradeTier = (): boolean => {
  const subscription = getSubscription();
  
  if (!subscription) {
    // If no subscription exists, user doesn't need to upgrade yet - they need to select a plan first
    return false;
  }
  
  // Check if scans limit reached and not on enterprise plan
  // For free plan, only return true if active is false (meaning they've used all scans)
  if (subscription.plan === 'free') {
    return !subscription.active;
  }
  
  return (
    subscription.scansUsed >= subscription.scansLimit && 
    subscription.plan !== 'enterprise'
  );
};
