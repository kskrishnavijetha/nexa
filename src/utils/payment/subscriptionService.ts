/**
 * Service for managing user subscriptions via Lovable Cloud database
 */

import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionInfo {
  active: boolean;
  plan: string;
  scansUsed: number;
  scansLimit: number;
  expirationDate: Date;
  billingCycle?: 'monthly' | 'annually' | 'lifetime';
  userId?: string;
  isLifetime?: boolean;
}

const PLAN_TIERS = {
  free:       { scans: 5,    days: 30   },
  starter:    { scans: 20,   days: 30   },
  pro:        { scans: 999,  days: 30   },
  enterprise: { scans: 999,  days: 30   },
  lifetime:   { scans: 9999, days: 3650 },
};

function mapRow(row: any): SubscriptionInfo {
  return {
    active:         row.active,
    plan:           row.plan,
    scansUsed:      row.scans_used,
    scansLimit:     row.scans_limit,
    expirationDate: new Date(row.expiration_date),
    billingCycle:   row.billing_cycle as SubscriptionInfo['billingCycle'],
    userId:         row.user_id,
    isLifetime:     row.is_lifetime,
  };
}

// ─── Save / upsert subscription ────────────────────────────────────────────

export const saveSubscription = async (
  plan: string,
  paymentId: string,
  billingCycle: 'monthly' | 'annually' | 'lifetime' = 'monthly',
  userId?: string
): Promise<SubscriptionInfo | null> => {
  if (!userId) {
    console.error('saveSubscription: userId is required');
    return null;
  }

  const tier = PLAN_TIERS[plan as keyof typeof PLAN_TIERS] || PLAN_TIERS.starter;
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + tier.days);

  const { data, error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id:         userId,
        plan,
        active:          true,
        scans_used:      0,
        scans_limit:     tier.scans,
        billing_cycle:   billingCycle,
        is_lifetime:     billingCycle === 'lifetime',
        expiration_date: expirationDate.toISOString(),
        payment_id:      paymentId,
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('saveSubscription error:', error);
    return null;
  }

  return mapRow(data);
};

// ─── Get subscription ───────────────────────────────────────────────────────

export const getSubscription = async (userId?: string): Promise<SubscriptionInfo | null> => {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('getSubscription error:', error);
    return null;
  }

  if (!data) return null;

  const sub = mapRow(data);

  // Mark as inactive if expired (non-lifetime)
  if (!sub.isLifetime && sub.expirationDate < new Date()) {
    sub.active = false;
  }

  return sub;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

export const hasActiveSubscription = async (userId?: string): Promise<boolean> => {
  const sub = await getSubscription(userId);
  return !!sub && sub.active;
};

export const hasScansRemaining = async (userId?: string): Promise<boolean> => {
  const sub = await getSubscription(userId);
  if (!sub || !sub.active) return false;
  return sub.isLifetime || sub.scansUsed < sub.scansLimit;
};

export const recordScanUsage = async (userId?: string): Promise<void> => {
  if (!userId) return;

  const sub = await getSubscription(userId);
  if (!sub || !sub.active || sub.isLifetime) return;

  const newUsed = sub.scansUsed + 1;
  const nowInactive = sub.plan === 'free' && newUsed >= sub.scansLimit;

  const { error } = await supabase
    .from('subscriptions')
    .update({
      scans_used: newUsed,
      ...(nowInactive ? { active: false } : {}),
    })
    .eq('user_id', userId);

  if (error) console.error('recordScanUsage error:', error);
};

export const shouldUpgrade = async (userId?: string): Promise<boolean> => {
  const sub = await getSubscription(userId);
  if (!sub || sub.isLifetime) return false;
  return !sub.active || sub.scansUsed >= sub.scansLimit;
};

export const shouldUpgradeTier = async (userId?: string): Promise<boolean> => {
  const sub = await getSubscription(userId);
  if (!sub || sub.isLifetime) return false;
  if (sub.plan === 'free') return sub.scansUsed >= sub.scansLimit;
  return (
    sub.scansUsed >= sub.scansLimit &&
    sub.plan !== 'enterprise' &&
    sub.plan !== 'pro'
  );
};

export const clearUserSubscription = (_userId: string): void => {
  // No-op: subscription data is preserved in the DB across sessions
};

// ─── Ensure free plan exists (called on sign-in) ────────────────────────────

export const ensureFreePlan = async (userId: string): Promise<void> => {
  const { data } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!data) {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 30);

    await supabase.from('subscriptions').insert({
      user_id:         userId,
      plan:            'free',
      active:          true,
      scans_used:      0,
      scans_limit:     5,
      billing_cycle:   'monthly',
      is_lifetime:     false,
      expiration_date: expiration.toISOString(),
    });
  }
};
