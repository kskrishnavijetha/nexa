
export const freeFeatures = [
  "1 compliance scan per day",
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

// Pricing data (monthly only now)
export const pricing = {
  free: {
    monthly: 0,
  },
  basic: {
    monthly: 35,
  },
  pro: {
    monthly: 110,
  },
  enterprise: {
    monthly: 399,
  }
};

// Format price helper (simplified for monthly only)
export const formatPrice = (price: number, cycle: 'monthly' | 'annually') => {
  if (price === 0) return "Free";
  return `$${price}/month`;
};
