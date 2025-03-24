
import React from 'react';
import { PricingTierKey, pricingTiers } from './PricingTier';

interface OrderSummaryProps {
  selectedTier: PricingTierKey;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ selectedTier }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Plan</span>
        <span>{pricingTiers[selectedTier].name}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Scans per month</span>
        <span>{pricingTiers[selectedTier].scans}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Billing</span>
        <span>{selectedTier === 'free' ? 'No billing' : 'Monthly'}</span>
      </div>
      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>{selectedTier === 'free' ? 'Free' : `$${pricingTiers[selectedTier].price}/month`}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
