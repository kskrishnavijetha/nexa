
import { useEffect, useState } from 'react';
import { shouldUpgrade, getSubscription } from '@/utils/paymentService';

export function useSubscriptionStatus(tier: string) {
  const [needsUpgrade, setNeedsUpgrade] = useState(false);

  useEffect(() => {
    async function checkUpgradeStatus() {
      try {
        // Only check for upgrade if not on free tier or explicitly requesting upgrade
        if (tier === 'free') {
          // For free tier, we'll only need upgrade if user has an expired paid plan
          const subscription = await getSubscription();
          setNeedsUpgrade(subscription?.plan !== 'free' && !subscription?.active);
        } else {
          // For paid plans, check normally
          const upgrade = await shouldUpgrade();
          setNeedsUpgrade(upgrade);
        }
      } catch (error) {
        console.error('Error checking upgrade status:', error);
      }
    }
    
    checkUpgradeStatus();
  }, [tier]);

  return { needsUpgrade };
}
