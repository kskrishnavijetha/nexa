
import { useEffect, useState } from 'react';
import { shouldUpgrade } from '@/utils/paymentService';

export function useSubscriptionStatus(tier: string) {
  const [needsUpgrade, setNeedsUpgrade] = useState(false);

  useEffect(() => {
    async function checkUpgradeStatus() {
      try {
        const upgrade = await shouldUpgrade();
        setNeedsUpgrade(upgrade || tier !== 'free');
      } catch (error) {
        console.error('Error checking upgrade status:', error);
      }
    }
    
    checkUpgradeStatus();
  }, [tier]);

  return { needsUpgrade };
}
