
import React from 'react';
import { Check } from 'lucide-react';

// Define pricing tiers
export const pricingTiers = {
  free: { name: 'Free', price: 0, scans: 1, monthly: true },
  basic: { name: 'Basic', price: 29, scans: 10, monthly: true },
  pro: { name: 'Pro', price: 99, scans: 50, monthly: true },
  enterprise: { name: 'Enterprise', price: 299, scans: 'Unlimited', monthly: true },
};

export type PricingTierKey = keyof typeof pricingTiers;

interface PricingTierProps {
  tierKey: PricingTierKey;
  isSelected: boolean;
  onClick: () => void;
}

const PricingTier: React.FC<PricingTierProps> = ({ tierKey, isSelected, onClick }) => {
  const tier = pricingTiers[tierKey];

  return (
    <div 
      className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-sm' 
          : 'border-input hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div className="font-medium">{tier.name}</div>
        {isSelected && (
          <Check className="h-5 w-5 text-primary" />
        )}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">
        {tier.scans} {typeof tier.scans === 'number' ? 'scans' : ''} per month
      </div>
      <div className="mt-2 font-semibold">
        {tier.price === 0 ? 'Free' : `$${tier.price}/month`}
      </div>
    </div>
  );
};

export default PricingTier;
