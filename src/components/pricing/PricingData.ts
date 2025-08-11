
export const freeFeatures = [
  "5 document scans per month",
  "AI Risk Analysis",
  "GDPR compliance only"
];

export const starterFeatures = [
  "20 document scans per month",
  "AI Risk Analysis",
  "GDPR & HIPAA compliance",
  "Predictive Analytics",
  "Smart Audit Trail",
  "Export to PDF"
];

export const proFeatures = [
  "Unlimited document scans",
  "AI Risk Analysis",
  "GDPR, HIPAA, & SOC 2 compliance",
  "Extended Audit Reports",
  "Predictive Analytics",
  "Smart Audit Trail",
  "Hash Verification",
  "Export to PDF",
  "Slack Alerts & Logs"
];

export const enterpriseFeatures = [
  "Unlimited document scans",
  "AI Risk Analysis", 
  "Full framework coverage (SOC 2, ISO, GLBA, PCI-DSS...)",
  "Extended Audit Reports",
  "Predictive Analytics",
  "Multi-user Smart Audit Trail",
  "Hash Verification",
  "Export to PDF",
  "Slack Alerts & Logs",
  "Custom Branding",
  "Priority Support & SLA"
];

// Pricing data
export const pricing = {
  free: {
    monthly: 0,
  },
  starter: {
    monthly: 59,
  },
  pro: {
    monthly: 149,
  },
  enterprise: {
    monthly: 599,
  }
};

// Format price helper
export const formatPrice = (price: number, cycle: 'monthly' | 'annually') => {
  if (price === 0) return "Free";
  return `$${price}/month`;
};
