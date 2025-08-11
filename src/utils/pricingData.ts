
export const getPrice = (tier: string, cycle: 'monthly' | 'annually'): number => {
  const prices = {
    free: { monthly: 0, annually: 0 },
    starter: { monthly: 29, annually: 290 },
    pro: { monthly: 99, annually: 990 },
    enterprise: { monthly: 299, annually: 2990 }
  };
  
  return prices[tier as keyof typeof prices]?.[cycle] || 0;
};

export const isFeatureAvailable = (feature: string, plan: string): boolean => {
  const featureAvailability: Record<string, string[]> = {
    extendedAuditReports: ['pro', 'enterprise'],
    hashVerification: ['starter', 'pro', 'enterprise'],
    apiAccess: ['pro', 'enterprise'],
    customBranding: ['enterprise'],
    prioritySupport: ['pro', 'enterprise'],
    unlimitedScans: ['pro', 'enterprise']
  };
  
  return featureAvailability[feature]?.includes(plan) || false;
};
