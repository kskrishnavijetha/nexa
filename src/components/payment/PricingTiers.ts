
// Define pricing tiers with their features

export const pricingTiers = {
  free: { name: 'Free', price: 0, scans: 1, monthly: true },
  basic: { name: 'Basic', price: 29, scans: 10, monthly: true },
  pro: { name: 'Pro', price: 99, scans: 50, monthly: true },
  enterprise: { name: 'Enterprise', price: 299, scans: 'Unlimited', monthly: true },
};

// Feature lists for each tier
export const tierFeatures = {
  free: [
    "1 compliance scan per month",
    "Basic GDPR compliance check",
    "Basic PDF report",
    "Community support"
  ],
  
  basic: [
    "10 compliance scans per month",
    "Basic GDPR, HIPAA, and SOC2 compliance checks",
    "Downloadable PDF reports",
    "Email support"
  ],
  
  pro: [
    "50 compliance scans per month",
    "Advanced compliance analysis for all regulations",
    "Detailed risk analysis with severity ratings",
    "AI-powered recommendations",
    "Priority email support"
  ],
  
  enterprise: [
    "Unlimited compliance scans",
    "Comprehensive compliance analysis for all regulations",
    "Custom compliance templates",
    "Advanced AI-powered suggestions",
    "Dedicated account manager",
    "24/7 priority support"
  ]
};
