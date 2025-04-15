
/**
 * Types for subscription services
 */
export interface SubscriptionInfo {
  active: boolean;
  plan: string;
  scansUsed: number;
  scansLimit: number;
  expirationDate: Date;
  billingCycle?: 'monthly' | 'annually';
}

export interface PlanTier {
  scans: number;
  days: number;
}

export interface PricingTiers {
  [key: string]: PlanTier;
}
