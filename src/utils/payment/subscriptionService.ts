
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
  isLifetime?: boolean;
}

// Store the user's current subscription in localStorage
export const saveSubscription = (plan: string, paymentId: string, billingCycle: 'monthly' | 'annually' = 'monthly', isLifetime: boolean = false) => {
  const pricingTiers = {
    free: { scans: 5, days: 30 },
    basic: { scans: 15, days: 30 },
    pro: { scans: 50, days: 30 },
    enterprise: { scans: 999, days: 30 }, // Using 999 to represent unlimited
    lifetime: { scans: 999, days: 36500 }, // ~100 years for lifetime
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
    billingCycle: billingCycle,
    isLifetime: isLifetime
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
  
  // Check if subscription is expired (lifetime subscriptions don't expire)
  if (!parsedSubscription.isLifetime && parsedSubscription.expirationDate < new Date()) {
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
    (subscription.isLifetime || subscription.scansUsed < subscription.scansLimit);
};

// Record a scan usage
export const recordScanUsage = (): void => {
  const subscription = getSubscription();
  if (subscription && subscription.active) {
    // Lifetime subscriptions have unlimited scans
    if (subscription.isLifetime) {
      return;
    }
    
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
  
  // Lifetime subscriptions never need upgrade
  if (subscription.isLifetime) {
    return false;
  }
  
  // If subscription has expired or no scans left
  return (
    !subscription.active || 
    subscription.scansUsed >= subscription.scansLimit
  );
};

// Check if user needs to upgrade specifically to a higher tier than they currently have
export const shouldUpgradeTier = (): boolean => {
  const subscription = getSubscription();
  
  if (!subscription) {
    return false;
  }
  
  // Lifetime subscriptions never need upgrade
  if (subscription.isLifetime) {
    return false;
  }
  
  // Check if scans limit reached and not on enterprise plan
  return (
    subscription.scansUsed >= subscription.scansLimit && 
    subscription.plan !== 'enterprise'
  );
};

// Add a special function to activate lifetime access for the current user
export const activateLifetimeAccess = (paymentId: string): SubscriptionInfo => {
  return saveSubscription('lifetime', paymentId, 'monthly', true);
};
