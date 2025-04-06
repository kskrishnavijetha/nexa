
import React from 'react';

interface PaymentSummaryProps {
  selectedTier: string;
  billingCycle: 'monthly' | 'annually';
  getPrice: (tier: string) => number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ 
  selectedTier, 
  billingCycle, 
  getPrice 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Plan</span>
        <span>{selectedTier === 'free' ? 'Free' : 
          selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Scans per month</span>
        <span>{selectedTier === 'enterprise' ? 'Unlimited' : (
          selectedTier === 'free' ? '1' : 
          selectedTier === 'basic' ? '10' : 
          selectedTier === 'pro' ? '50' : ''
        )}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Billing</span>
        <span>{selectedTier === 'free' ? 'No billing' : (billingCycle === 'monthly' ? 'Monthly' : 'Annually')}</span>
      </div>
      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>
          {getPrice(selectedTier) === 0 
            ? 'Free' 
            : `$${getPrice(selectedTier)}/${billingCycle === 'monthly' ? 'month' : 'year'}`
          }
        </span>
      </div>
    </div>
  );
};

export default PaymentSummary;
