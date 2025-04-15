
// Pricing tiers configuration
export const pricingTiers = {
  free: {
    name: 'Free',
    scans: 4, // 1 per week
    days: 30,
    features: {
      aiRiskAnalysis: true,
      extendedAuditReports: false,
      predictiveAnalytics: false,
      smartAuditTrail: false,
      hashVerification: false,
      exportToPdf: false,
      frameworkCoverage: 'GDPR only',
      slackAlerts: false,
      customBranding: false,
      prioritySupport: false
    }
  },
  starter: {
    name: 'Starter',
    scans: 20,
    days: 30,
    features: {
      aiRiskAnalysis: true,
      extendedAuditReports: false,
      predictiveAnalytics: true,
      smartAuditTrail: true,
      hashVerification: false,
      exportToPdf: true,
      frameworkCoverage: 'GDPR, HIPAA',
      slackAlerts: false,
      customBranding: false,
      prioritySupport: false
    }
  },
  pro: {
    name: 'Pro',
    scans: 999, // Using 999 to represent unlimited
    days: 30,
    features: {
      aiRiskAnalysis: true,
      extendedAuditReports: true,
      predictiveAnalytics: true,
      smartAuditTrail: true,
      hashVerification: true,
      exportToPdf: true,
      frameworkCoverage: 'GDPR, HIPAA, SOC 2',
      slackAlerts: true,
      customBranding: false,
      prioritySupport: false
    }
  },
  enterprise: {
    name: 'Enterprise',
    scans: 999, // Using 999 to represent unlimited
    days: 30,
    features: {
      aiRiskAnalysis: true,
      extendedAuditReports: true,
      predictiveAnalytics: true,
      smartAuditTrail: 'Multi-user',
      hashVerification: true,
      exportToPdf: true,
      frameworkCoverage: 'Full (SOC 2, ISO, GLBA, PCI-DSS...)',
      slackAlerts: true,
      customBranding: true,
      prioritySupport: true
    }
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

// Helper function to determine if a feature is available for a given tier
export const isFeatureAvailable = (feature: string, tier: string): boolean | string => {
  // Safety check
  if (!pricingTiers[tier as keyof typeof pricingTiers]) return false;
  
  // Get the feature value
  const featureValue = pricingTiers[tier as keyof typeof pricingTiers].features[feature as keyof typeof pricingTiers.free.features];
  
  // Return the feature value (could be boolean or string)
  return featureValue;
};
