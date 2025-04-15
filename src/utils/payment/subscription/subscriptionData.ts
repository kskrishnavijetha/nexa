
/**
 * Service for managing subscription data in Supabase
 */
import { supabase } from '@/integrations/supabase/client';
import { PRICING_TIERS, DEFAULT_SCAN_LIMIT } from './constants';
import { SubscriptionInfo } from './types';

export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
};

export const getSubscriptionData = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('subscription_plan, subscription_status, scans_used, scans_limit, subscription_end_date, billing_cycle')
    .eq('id', userId)
    .single();
  
  if (error || !data) {
    console.error('Error fetching subscription from Supabase:', error);
    return null;
  }
  
  return data;
};

export const updateSubscriptionStatus = async (userId: string, isActive: boolean): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ subscription_status: isActive })
    .eq('id', userId);
  
  if (error) {
    console.error('Error updating subscription status:', error);
  }
};

export const updateScanUsage = async (userId: string, newScansUsed: number, shouldDeactivate: boolean = false): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({
      scans_used: newScansUsed,
      subscription_status: shouldDeactivate ? false : undefined
    })
    .eq('id', userId);
  
  if (error) {
    console.error('Error updating scan usage:', error);
  }
};

export const saveSubscriptionData = async (
  userId: string,
  plan: string,
  expirationDate: Date,
  billingCycle: 'monthly' | 'annually'
): Promise<boolean> => {
  const selectedTier = PRICING_TIERS[plan] || PRICING_TIERS.basic;
  
  const { error } = await supabase
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
    return false;
  }
  
  return true;
};
