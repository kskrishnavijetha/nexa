
// Pricing tiers configuration
export const pricingTiers = {
  free: {
    name: 'Free',
    scans: 5,
    days: 30
  },
  basic: {
    name: 'Basic',
    scans: 15,
    days: 30
  },
  pro: {
    name: 'Pro',
    scans: 50,
    days: 30
  },
  enterprise: {
    name: 'Enterprise',
    scans: 'Unlimited'
  }
};

// Pricing data with 10% discount for annual billing
export const getPrice = (tier: string, billingCycle: 'monthly' | 'annually'): number => {
  const prices = {
    free: 0,
    basic: {
      monthly: 35,
      annually: Math.round(35 * 12 * 0.9), // 10% discount
    },
    pro: {
      monthly: 110,
      annually: Math.round(110 * 12 * 0.9), // 10% discount
    },
    enterprise: {
      monthly: 399,
      annually: Math.round(399 * 12 * 0.9), // 10% discount
    }
  };
  
  if (tier === 'free') return 0;
  
  return prices[tier as keyof typeof prices][billingCycle];
};
