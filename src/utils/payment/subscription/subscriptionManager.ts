
/**
 * Core subscription management service
 */
import { SubscriptionInfo } from './types';
import { PRICING_TIERS, DEFAULT_SCAN_LIMIT } from './constants';
import { 
  getCurrentUserId, 
  getSubscriptionData, 
  updateSubscriptionStatus,
  updateScanUsage,
  saveSubscriptionData
} from './subscriptionData';
import { 
  storeSubscriptionLocal, 
  getSubscriptionLocal,
  updateLocalSubscriptionUsage 
} from './subscriptionStorage';

// Save or update a user's subscription in Supabase
export const saveSubscription = async (
  plan: string, 
  paymentId: string, 
  billingCycle: 'monthly' | 'annually' = 'monthly'
): Promise<SubscriptionInfo | null> => {
  try {
    // Get current session to ensure user is authenticated
    const userId = await getCurrentUserId();
    
    if (!userId) {
      console.error('Cannot save subscription: No authenticated user');
      return null;
    }
    
    // Calculate plan duration and scan limits
    const selectedTier = PRICING_TIERS[plan as keyof typeof PRICING_TIERS] || PRICING_TIERS.basic;
    
    // Calculate new expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + selectedTier.days);
    
    console.log('Updating subscription in Supabase for user:', userId);
    console.log('Subscription details:', { plan, scans_limit: selectedTier.scans, expiration: expirationDate.toISOString() });

    // Update the user's profile in Supabase
    const success = await saveSubscriptionData(userId, plan, expirationDate, billingCycle);
    
    if (!success) {
      return null;
    }
    
    // For backward compatibility, also store in localStorage
    const subscriptionInfo: SubscriptionInfo = {
      active: true,
      plan: plan,
      scansUsed: 0,
      scansLimit: selectedTier.scans,
      expirationDate: expirationDate,
      billingCycle: billingCycle
    };
    
    storeSubscriptionLocal(subscriptionInfo);
    
    console.log('Subscription saved successfully');
    return subscriptionInfo;
  } catch (error) {
    console.error('Error in saveSubscription:', error);
    return null;
  }
};

// Get the current subscription from Supabase
export const getSubscription = async (): Promise<SubscriptionInfo | null> => {
  try {
    // First try to get from Supabase (source of truth)
    const userId = await getCurrentUserId();
    
    if (!userId) {
      // Not authenticated, return null or local fallback
      return getSubscriptionLocal();
    }
    
    // Get profile data from Supabase
    const data = await getSubscriptionData(userId);
    
    if (!data) {
      return getSubscriptionLocal();
    }
    
    // Check if subscription is expired
    const isExpired = data.subscription_end_date 
      ? new Date(data.subscription_end_date) < new Date() 
      : true;
    
    // If subscription is expired, update the status in database
    if (data.subscription_status && isExpired) {
      await updateSubscriptionStatus(userId, false);
    }
    
    // Convert to SubscriptionInfo format for consistency
    return {
      active: data.subscription_status && !isExpired,
      plan: data.subscription_plan || 'free',
      scansUsed: data.scans_used || 0,
      scansLimit: data.scans_limit || DEFAULT_SCAN_LIMIT,
      expirationDate: data.subscription_end_date ? new Date(data.subscription_end_date) : new Date(),
      billingCycle: (data.billing_cycle as 'monthly' | 'annually') || 'monthly'
    };
  } catch (error) {
    console.error('Error in getSubscription:', error);
    
    // Fallback to localStorage if Supabase fails
    return getSubscriptionLocal();
  }
};

// Check if user has an active subscription
export const hasActiveSubscription = async (): Promise<boolean> => {
  const subscription = await getSubscription();
  return !!subscription && subscription.active;
};

// Check if user has scans remaining
export const hasScansRemaining = async (): Promise<boolean> => {
  const subscription = await getSubscription();
  return !!subscription && 
    subscription.active && 
    subscription.scansUsed < subscription.scansLimit;
};

// Record a scan usage
export const recordScanUsage = async (): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      console.error('Cannot record scan usage: No authenticated user');
      return;
    }
    
    // Get current profile data
    const profile = await getSubscriptionData(userId);
    
    if (!profile) {
      return;
    }
    
    const newScansUsed = (profile.scans_used || 0) + 1;
    const shouldDeactivateFree = profile.subscription_plan === 'free' && 
      newScansUsed >= (profile.scans_limit || DEFAULT_SCAN_LIMIT);
    
    // Update the profile with new scan count
    await updateScanUsage(userId, newScansUsed, shouldDeactivateFree);
    
    // For backward compatibility, also update localStorage
    updateLocalSubscriptionUsage(newScansUsed, profile.subscription_plan, profile.scans_limit || DEFAULT_SCAN_LIMIT);
  } catch (error) {
    console.error('Error in recordScanUsage:', error);
  }
};

// Check if user needs to upgrade (free plan with no scans left or expired)
export const shouldUpgrade = async (): Promise<boolean> => {
  const subscription = await getSubscription();
  
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
export const shouldUpgradeTier = async (): Promise<boolean> => {
  const subscription = await getSubscription();
  
  if (!subscription) {
    return false;
  }
  
  // Check if scans limit reached and not on enterprise plan
  return (
    subscription.scansUsed >= subscription.scansLimit && 
    subscription.plan !== 'enterprise'
  );
};
