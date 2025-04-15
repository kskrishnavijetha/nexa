/**
 * Service for managing user subscriptions using Supabase profiles table
 */
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface SubscriptionInfo {
  active: boolean;
  plan: string;
  scansUsed: number;
  scansLimit: number;
  expirationDate: Date;
  billingCycle?: 'monthly' | 'annually';
}

// Save or update a user's subscription in Supabase
export const saveSubscription = async (
  plan: string, 
  paymentId: string, 
  billingCycle: 'monthly' | 'annually' = 'monthly'
): Promise<SubscriptionInfo | null> => {
  try {
    // Get current session to ensure user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      console.error('Cannot save subscription: No authenticated user');
      return null;
    }
    
    // Calculate plan duration and scan limits
    const pricingTiers = {
      free: { scans: 5, days: 30 },
      basic: { scans: 15, days: 30 },
      pro: { scans: 50, days: 30 },
      enterprise: { scans: 999, days: 30 }, // Using 999 to represent unlimited
    };
    
    const selectedTier = pricingTiers[plan as keyof typeof pricingTiers] || pricingTiers.basic;
    
    // Calculate new expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + selectedTier.days);
    
    console.log('Updating subscription in Supabase for user:', userId);
    console.log('Subscription details:', { plan, scans_limit: selectedTier.scans, expiration: expirationDate.toISOString() });

    // Update the user's profile in Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update({
        subscription_plan: plan,
        subscription_status: true,
        scans_used: 0, // Reset scan count on new subscription
        scans_limit: selectedTier.scans,
        billing_cycle: billingCycle,
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: expirationDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error saving subscription to Supabase:', error);
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
    
    localStorage.setItem('subscription', JSON.stringify(subscriptionInfo));
    
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
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      // Not authenticated, return null or local fallback
      const localSub = localStorage.getItem('subscription');
      if (localSub) {
        const parsed = JSON.parse(localSub);
        parsed.expirationDate = new Date(parsed.expirationDate);
        
        // Check if subscription is expired
        if (parsed.expirationDate < new Date()) {
          parsed.active = false;
        }
        return parsed;
      }
      return null;
    }
    
    // Get profile data from Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_plan, subscription_status, scans_used, scans_limit, subscription_end_date, billing_cycle')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching subscription from Supabase:', error);
      return null;
    }
    
    // Check if subscription is expired
    const isExpired = data.subscription_end_date 
      ? new Date(data.subscription_end_date) < new Date() 
      : true;
    
    // If subscription is expired, update the status in database
    if (data.subscription_status && isExpired) {
      await supabase
        .from('profiles')
        .update({ subscription_status: false })
        .eq('id', userId);
    }
    
    // Convert to SubscriptionInfo format for consistency
    return {
      active: data.subscription_status && !isExpired,
      plan: data.subscription_plan || 'free',
      scansUsed: data.scans_used || 0,
      scansLimit: data.scans_limit || 5,
      expirationDate: data.subscription_end_date ? new Date(data.subscription_end_date) : new Date(),
      billingCycle: (data.billing_cycle as 'monthly' | 'annually') || 'monthly'
    };
  } catch (error) {
    console.error('Error in getSubscription:', error);
    
    // Fallback to localStorage if Supabase fails
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
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      console.error('Cannot record scan usage: No authenticated user');
      return;
    }
    
    // Get current profile data
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('scans_used, scans_limit, subscription_plan, subscription_status')
      .eq('id', userId)
      .single();
    
    if (fetchError || !profile) {
      console.error('Error fetching profile for scan usage:', fetchError);
      return;
    }
    
    const newScansUsed = (profile.scans_used || 0) + 1;
    const shouldDeactivateFree = profile.subscription_plan === 'free' && 
      newScansUsed >= (profile.scans_limit || 5);
    
    // Update the profile with new scan count
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        scans_used: newScansUsed,
        subscription_status: shouldDeactivateFree ? false : profile.subscription_status
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Error updating scan usage:', updateError);
    }
    
    // For backward compatibility, also update localStorage
    const localSubscription = localStorage.getItem('subscription');
    if (localSubscription) {
      const subscription = JSON.parse(localSubscription);
      subscription.scansUsed = newScansUsed;
      
      // Check if scans limit reached for free plan
      if (subscription.plan === 'free' && subscription.scansUsed >= subscription.scansLimit) {
        subscription.active = false;
      }
      
      localStorage.setItem('subscription', JSON.stringify(subscription));
    }
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
