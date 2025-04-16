
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getPrice } from '@/utils/pricingData';

interface PaymentTierSelectorProps {
  selectedTier: string;
  billingCycle: 'monthly' | 'annually';
  onSelectTier: (tier: string) => void;
  initialTier?: string | null;
}

const PaymentTierSelector: React.FC<PaymentTierSelectorProps> = ({
  selectedTier,
  billingCycle,
  onSelectTier,
  initialTier
}) => {
  const tiers = [
    { id: 'free', name: 'Free', description: '5 document scans per month with basic compliance analysis' },
    { id: 'starter', name: 'Starter', description: '20 document scans per month with PDF reports' },
    { id: 'pro', name: 'Pro', description: 'Unlimited scans with advanced analysis and features' },
    { id: 'enterprise', name: 'Enterprise', description: 'Unlimited scans with multi-user support and custom branding' }
  ];

  return (
    <RadioGroup
      value={selectedTier}
      onValueChange={onSelectTier}
      className="grid gap-3"
    >
      {tiers.map((tier) => {
        // Skip free tier if initialTier is set (user is upgrading)
        if (tier.id === 'free' && initialTier && initialTier !== 'free') {
          return null;
        }
        
        const price = tier.id === 'free' ? 'Free' : `$${getPrice(tier.id, billingCycle)}/month`;
            
        return (
          <div key={tier.id} className="flex items-start space-x-2">
            <RadioGroupItem value={tier.id} id={`tier-${tier.id}`} className="mt-1" />
            <div className="grid gap-0.5 w-full">
              <Label htmlFor={`tier-${tier.id}`} className="flex justify-between">
                <span>{tier.name}</span>
                <span>{price}</span>
              </Label>
              <span className="text-sm text-muted-foreground">{tier.description}</span>
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default PaymentTierSelector;
