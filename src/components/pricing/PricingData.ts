
export const freeFeatures = [
  "1 compliance scan per month",
  "Basic GDPR compliance check",
  "Basic PDF report",
  "Community support"
];

export const basicFeatures = [
  "10 compliance scans per month",
  "Basic GDPR, HIPAA, and SOC2 compliance checks",
  "Downloadable PDF reports",
  "Email support"
];

export const proFeatures = [
  "50 compliance scans per month",
  "Advanced compliance analysis for all regulations",
  "Detailed risk analysis with severity ratings",
  "AI-powered recommendations",
  "Priority email support"
];

export const enterpriseFeatures = [
  "Unlimited compliance scans",
  "Comprehensive compliance analysis for all regulations",
  "Custom compliance templates",
  "Advanced AI-powered suggestions",
  "Dedicated account manager",
  "24/7 priority support"
];

// Apply 10% discount for annual billing
export const annualDiscount = 0.1; // 10% discount

// Pricing data
export const pricing = {
  free: {
    monthly: 0,
    annually: 0,
  },
  basic: {
    monthly: 35,
    annually: Math.round(35 * 12 * (1 - annualDiscount)),
  },
  pro: {
    monthly: 110,
    annually: Math.round(110 * 12 * (1 - annualDiscount)),
  },
  enterprise: {
    monthly: 399,
    annually: Math.round(399 * 12 * (1 - annualDiscount)),
  }
};

// Format price helper
export const formatPrice = (price: number, cycle: 'monthly' | 'annually') => {
  if (price === 0) return "Free";
  return `$${price}${cycle === 'monthly' ? '/month' : '/year'}`;
};
