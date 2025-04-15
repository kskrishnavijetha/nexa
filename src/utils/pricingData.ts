
// Pricing tiers configuration
export const pricingTiers = {
  free: {
    name: 'Free',
    scans: 4, // 1 per week
    days: 30
  },
  starter: {
    name: 'Starter',
    scans: 20,
    days: 30
  },
  pro: {
    name: 'Pro',
    scans: 999, // Using 999 to represent unlimited
    days: 30
  },
  enterprise: {
    name: 'Enterprise',
    scans: 999, // Using 999 to represent unlimited
  }
};

// Pricing data with 10% discount for annual billing
export const getPrice = (tier: string, billingCycle: 'monthly' | 'annually'): number => {
  const prices = {
    free: 0,
    starter: {
      monthly: 59,
      annually: Math.round(59 * 12 * 0.9), // 10% discount
    },
    pro: {
      monthly: 149,
      annually: Math.round(149 * 12 * 0.9), // 10% discount
    },
    enterprise: {
      monthly: 599,
      annually: Math.round(599 * 12 * 0.9), // 10% discount
    }
  };
  
  if (tier === 'free') return 0;
  
  return prices[tier as keyof typeof prices][billingCycle];
};
