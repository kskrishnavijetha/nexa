
/**
 * Service for managing subscription storage (localStorage)
 */
import { SubscriptionInfo } from './types';

export const storeSubscriptionLocal = (subscription: SubscriptionInfo): void => {
  localStorage.setItem('subscription', JSON.stringify(subscription));
};

export const getSubscriptionLocal = (): SubscriptionInfo | null => {
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
};

export const updateLocalSubscriptionUsage = (newScansUsed: number, plan: string, scansLimit: number): void => {
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
};
