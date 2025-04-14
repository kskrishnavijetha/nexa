
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/components/pricing/PricingData';

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
    { id: 'free', name: 'Free', description: 'Basic compliance analysis and 5 scans per month' },
    { id: 'basic', name: 'Basic', description: '15 scans per month with PDF reports' },
    { id: 'pro', name: 'Pro', description: '50 scans per month with advanced analysis' },
    { id: 'enterprise', name: 'Enterprise', description: 'Unlimited scans with custom templates' },
    { id: 'lifetime', name: 'Lifetime', description: 'One-time payment for unlimited lifetime access' }
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
        
        const price = tier.id === 'lifetime' 
          ? '$999 (one-time)' 
          : formatPrice(
              tier.id === 'free' ? 0 : { 
                free: 0, basic: 35, pro: 110, enterprise: 399 
              }[tier.id as 'free' | 'basic' | 'pro' | 'enterprise'], 
              billingCycle
            );
            
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
