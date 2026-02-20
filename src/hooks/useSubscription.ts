/**
 * React hook that fetches the current user's subscription from the database
 * and re-fetches whenever the user changes or the subscription row changes (realtime).
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  getSubscription,
  ensureFreePlan,
  SubscriptionInfo,
} from '@/utils/payment/subscriptionService';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    await ensureFreePlan(user.id);
    const sub = await getSubscription(user.id);
    setSubscription(sub);
    setLoading(false);
  }, [user?.id]);

  // Initial fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Realtime subscription updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`subscription:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          // Refetch on any change to this user's subscription row
          const sub = await getSubscription(user.id);
          setSubscription(sub);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const scansRemaining =
    subscription && !subscription.isLifetime
      ? Math.max(0, subscription.scansLimit - subscription.scansUsed)
      : subscription?.isLifetime
      ? Infinity
      : 0;

  const needsUpgrade =
    !!subscription &&
    !subscription.isLifetime &&
    (!subscription.active || subscription.scansUsed >= subscription.scansLimit);

  return { subscription, loading, refresh, scansRemaining, needsUpgrade };
}
