
export const getPrice = (tier: string, cycle: 'monthly' | 'annually'): number => {
  const prices = {
    free: { monthly: 0, annually: 0 },
    starter: { monthly: 29, annually: 290 },
    pro: { monthly: 99, annually: 990 },
    enterprise: { monthly: 299, annually: 2990 }
  };
  
  return prices[tier as keyof typeof prices]?.[cycle] || 0;
};
