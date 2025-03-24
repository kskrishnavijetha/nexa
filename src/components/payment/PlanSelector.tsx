
import React from 'react';
import { Check } from 'lucide-react';
import { pricingTiers } from './PricingTiers';

interface PlanSelectorProps {
  selectedTier: keyof typeof pricingTiers;
  setSelectedTier: React.Dispatch<React.SetStateAction<keyof typeof pricingTiers>>;
}

const PlanSelector = ({ selectedTier, setSelectedTier }: PlanSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select a Plan</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(pricingTiers).map(([key, tier]) => (
          <div 
            key={key}
            className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
              selectedTier === key 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-input hover:border-primary/50'
            }`}
            onClick={() => setSelectedTier(key as keyof typeof pricingTiers)}
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
              {tier.price === 0 ? 'Free' : `$${tier.price}/month`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanSelector;
