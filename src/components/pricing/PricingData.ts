
export const pricing = {
  free: { monthly: 0, annually: 0 },
  starter: { monthly: 29, annually: 290 },
  pro: { monthly: 99, annually: 990 },
  enterprise: { monthly: 299, annually: 2990 }
};

export const formatPrice = (price: number): string => {
  return price === 0 ? 'Free' : `$${price}`;
};

export const freeFeatures = [
  '3 document scans per month',
  'Basic compliance analysis',
  'Standard reports'
];

export const starterFeatures = [
  '20 document scans per month',
  'Enhanced compliance analysis',
  'PDF report generation',
  'Email support'
];

export const proFeatures = [
  'Unlimited document scans',
  'Advanced AI analysis',
  'Custom report templates',
  'Priority support',
  'API access'
];

export const enterpriseFeatures = [
  'Everything in Pro',
  'Multi-user support',
  'Custom branding',
  'Dedicated support',
  'Advanced integrations'
];
