
import React from 'react';
import { Check } from 'lucide-react';
import { pricingTiers } from '@/utils/pricingData';

interface PaymentTierSelectorProps {
  selectedTier: string;
  billingCycle: 'monthly' | 'annually';
  onSelectTier: (tier: string) => void;
  getPrice: (tier: string) => number;
  disabled?: boolean;
}

const PaymentTierSelector: React.FC<PaymentTierSelectorProps> = ({
  selectedTier,
  billingCycle,
  onSelectTier,
  getPrice,
  disabled = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(pricingTiers).map(([key, tier]) => (
        <div 
          key={key}
          className={`relative rounded-lg border p-4 transition-all ${
            disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
          } ${
            selectedTier === key 
              ? 'border-primary bg-primary/5 shadow-sm' 
              : 'border-input hover:border-primary/50'
          }`}
          onClick={() => {
            if (!disabled) {
              onSelectTier(key);
            }
          }}
        >
          <div className="flex justify-between">
            <div className="font-medium">{tier.name}</div>
            {selectedTier === key && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {tier.scans} {typeof tier.scans === 'number' ? 'scans' : ''} per month
          </div>
          <div className="mt-2 font-semibold">
            {getPrice(key) === 0 
              ? 'Free' 
              : `$${getPrice(key)}/${billingCycle === 'monthly' ? 'month' : 'year'}`
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentTierSelector;
