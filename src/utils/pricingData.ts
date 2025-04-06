
// Define pricing tiers
export const pricingTiers = {
  free: { name: 'Free', price: 0, scans: 1, monthly: true },
  basic: { 
    name: 'Basic', 
    price: { monthly: 35, annually: 378 }, // 35 * 12 * 0.9 = 378 (10% discount)
    scans: 10, 
  },
  pro: { 
    name: 'Pro', 
    price: { monthly: 110, annually: 1188 }, // 110 * 12 * 0.9 = 1188 (10% discount)
    scans: 50, 
  },
  enterprise: { 
    name: 'Enterprise', 
    price: { monthly: 399, annually: 4309 }, // 399 * 12 * 0.9 = 4309.2 rounded to 4309 (10% discount)
    scans: 'Unlimited', 
  },
};

// Helper function to get price based on billing cycle
export const getPrice = (tier: string, billingCycle: 'monthly' | 'annually') => {
  const tierData = pricingTiers[tier as keyof typeof pricingTiers];
  if (!tierData) return 0;
  
  const price = tierData.price;
  if (typeof price === 'object') {
    return price[billingCycle];
  }
  return price;
};

// Get scans per month for the tier
export const getScansPerMonth = (tier: string): string | number => {
  const tierData = pricingTiers[tier as keyof typeof pricingTiers];
  return tierData?.scans || 0;
};
