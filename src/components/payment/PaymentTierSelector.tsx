
import React, { useEffect, useState } from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getSubscription } from '@/utils/paymentService';
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
  const [currentSubscription, setCurrentSubscription] = useState(getSubscription());
  
  useEffect(() => {
    // Update selected tier based on initial value or current subscription if upgrading
    if (initialTier) {
      onSelectTier(initialTier);
    } else if (currentSubscription) {
      // If they've exhausted a plan or it expired, suggest the next tier up
      if (currentSubscription.scansUsed >= currentSubscription.scansLimit || !currentSubscription.active) {
        if (currentSubscription.plan === 'free') {
          onSelectTier('basic');
        } else if (currentSubscription.plan === 'basic') {
          onSelectTier('pro');
        } else if (currentSubscription.plan === 'pro') {
          onSelectTier('enterprise');
        }
      }
    }
  }, [initialTier, currentSubscription, onSelectTier]);

  const getTierLabel = (tier: string) => {
    const price = getPrice(tier, billingCycle);
    return tier === 'free' ? 'Free' : `$${price}/${billingCycle === 'monthly' ? 'month' : 'year'}`;
  };

  const shouldDisableTier = (tier: string) => {
    // If the user has a current subscription and they're out of scans or it expired,
    // don't let them select the same or lower tiers, and don't let them select free
    if (currentSubscription) {
      if ((currentSubscription.scansUsed >= currentSubscription.scansLimit || !currentSubscription.active) && tier === 'free') {
        return true;
      }
      
      if (currentSubscription.scansUsed >= currentSubscription.scansLimit || !currentSubscription.active) {
        if (tier === 'basic' && currentSubscription.plan === 'basic') return true;
        if (tier === 'pro' && currentSubscription.plan === 'pro') return true;
      }
    }
    
    return false;
  };

  // Update free tier option visibility
  const shouldHideFreeTier = currentSubscription && 
    (currentSubscription.scansUsed >= currentSubscription.scansLimit || !currentSubscription.active);

  return (
    <div>
      <Label className="block text-sm font-medium mb-2">Select a plan</Label>
      <RadioGroup
        value={selectedTier}
        onValueChange={onSelectTier}
        className="space-y-2"
      >
        {!shouldHideFreeTier && (
          <div className={`flex items-center space-x-2 p-3 rounded border ${selectedTier === 'free' ? 'border-primary bg-primary/5' : 'border-gray-200'} ${shouldDisableTier('free') ? 'opacity-50' : ''}`}>
            <input
              type="radio"
              id="free"
              value="free"
              checked={selectedTier === 'free'}
              onChange={() => onSelectTier('free')}
              disabled={shouldDisableTier('free')}
              className="h-4 w-4 text-primary"
            />
            <Label htmlFor="free" className="flex-1 cursor-pointer">
              <span>Free Plan</span>
              <p className="text-sm text-muted-foreground">{getTierLabel('free')}</p>
            </Label>
          </div>
        )}
        
        <div className={`flex items-center space-x-2 p-3 rounded border ${selectedTier === 'basic' ? 'border-primary bg-primary/5' : 'border-gray-200'} ${shouldDisableTier('basic') ? 'opacity-50' : ''}`}>
          <input
            type="radio"
            id="basic"
            value="basic"
            checked={selectedTier === 'basic'}
            onChange={() => onSelectTier('basic')}
            disabled={shouldDisableTier('basic')}
            className="h-4 w-4 text-primary"
          />
          <Label htmlFor="basic" className="flex-1 cursor-pointer">
            <span>Basic Plan</span>
            <p className="text-sm text-muted-foreground">{getTierLabel('basic')}</p>
          </Label>
        </div>
        
        <div className={`flex items-center space-x-2 p-3 rounded border ${selectedTier === 'pro' ? 'border-primary bg-primary/5' : 'border-gray-200'} ${shouldDisableTier('pro') ? 'opacity-50' : ''}`}>
          <input
            type="radio"
            id="pro"
            value="pro"
            checked={selectedTier === 'pro'}
            onChange={() => onSelectTier('pro')}
            disabled={shouldDisableTier('pro')}
            className="h-4 w-4 text-primary"
          />
          <Label htmlFor="pro" className="flex-1 cursor-pointer">
            <span>Pro Plan</span>
            <span className="ml-2 text-xs bg-gradient-to-r from-amber-500 to-amber-300 text-white px-2 py-0.5 rounded-full">RECOMMENDED</span>
            <p className="text-sm text-muted-foreground">{getTierLabel('pro')}</p>
          </Label>
        </div>
        
        <div className={`flex items-center space-x-2 p-3 rounded border ${selectedTier === 'enterprise' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
          <input
            type="radio"
            id="enterprise"
            value="enterprise"
            checked={selectedTier === 'enterprise'}
            onChange={() => onSelectTier('enterprise')}
            className="h-4 w-4 text-primary"
          />
          <Label htmlFor="enterprise" className="flex-1 cursor-pointer">
            <span>Enterprise Plan</span>
            <p className="text-sm text-muted-foreground">{getTierLabel('enterprise')}</p>
          </Label>
        </div>
      </RadioGroup>
      
      {currentSubscription && currentSubscription.scansUsed >= currentSubscription.scansLimit && (
        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
          You've used all scans in your {currentSubscription.plan} plan. Please upgrade to continue.
        </div>
      )}
      
      {currentSubscription && !currentSubscription.active && (
        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
          Your {currentSubscription.plan} plan has expired. Please subscribe to a new plan to continue.
        </div>
      )}
    </div>
  );
};

export default PaymentTierSelector;
