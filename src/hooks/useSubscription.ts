/**
 * React hook that fetches the current user's subscription from the database
 * and re-fetches whenever the user changes.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
    // Ensure every logged-in user has at least a free plan row
    await ensureFreePlan(user.id);
    const sub = await getSubscription(user.id);
    setSubscription(sub);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
