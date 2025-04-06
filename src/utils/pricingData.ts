
// Define pricing tiers
export const pricingTiers = {
  free: { name: 'Free', price: 0, scans: 1, monthly: true },
  basic: { 
    name: 'Basic', 
    price: 35,
    scans: 10, 
  },
  pro: { 
    name: 'Pro', 
    price: 110,
    scans: 50, 
  },
  enterprise: { 
    name: 'Enterprise', 
    price: 399,
    scans: 'Unlimited', 
  },
};

// Helper function to get price based on billing cycle
export const getPrice = (tier: string, billingCycle: 'monthly' | 'annually') => {
  const tierData = pricingTiers[tier as keyof typeof pricingTiers];
  if (!tierData) return 0;
  
  return typeof tierData.price === 'object' ? tierData.price : tierData.price;
};

// Get scans per month for the tier
export const getScansPerMonth = (tier: string): string | number => {
  const tierData = pricingTiers[tier as keyof typeof pricingTiers];
  return tierData?.scans || 0;
};
