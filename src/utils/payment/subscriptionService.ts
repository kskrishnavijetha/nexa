
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
    basic: { scans: 10, days: billingCycle === 'monthly' ? 30 : 365 },
    pro: { scans: 50, days: billingCycle === 'monthly' ? 30 : 365 },
    enterprise: { scans: 999, days: billingCycle === 'monthly' ? 30 : 365 }, // Using 999 to represent unlimited
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
  console.log('Saved subscription:', JSON.stringify(subscription));
  return subscription;
};

// Get the current subscription from localStorage
export const getSubscription = (): SubscriptionInfo | null => {
  const subscription = localStorage.getItem('subscription');
  if (!subscription) {
    console.log('No subscription found in localStorage');
    return null;
  }
  
  try {
    const parsedSubscription = JSON.parse(subscription);
    parsedSubscription.expirationDate = new Date(parsedSubscription.expirationDate);
    
    // Check if subscription is expired
    const isExpired = parsedSubscription.expirationDate < new Date();
    if (isExpired) {
      console.log('Subscription found but expired. Expiration date:', parsedSubscription.expirationDate);
      parsedSubscription.active = false;
    } else {
      console.log('Active subscription found. Expiration date:', parsedSubscription.expirationDate);
    }
    
    return parsedSubscription;
  } catch (error) {
    console.error('Error parsing subscription:', error);
    localStorage.removeItem('subscription');
    return null;
  }
};

// Check if user has an active subscription
export const hasActiveSubscription = (): boolean => {
  const subscription = getSubscription();
  const result = !!subscription && subscription.active;
  console.log('hasActiveSubscription check result:', result);
  return result;
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
