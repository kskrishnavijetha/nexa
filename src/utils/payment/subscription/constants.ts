
/**
 * Constants for subscription services
 */
import { PricingTiers } from './types';

export const PRICING_TIERS: PricingTiers = {
  free: { scans: 5, days: 30 },
  basic: { scans: 15, days: 30 },
  pro: { scans: 50, days: 30 },
  enterprise: { scans: 999, days: 30 }, // Using 999 to represent unlimited
};

export const DEFAULT_SCAN_LIMIT = 5;
