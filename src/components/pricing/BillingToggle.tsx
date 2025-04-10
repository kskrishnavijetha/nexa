
import React from 'react';
import { Label } from '@/components/ui/label';

interface BillingToggleProps {
  billingCycle: 'monthly';
  onChange: (billingCycle: 'monthly') => void;
}

const BillingToggle: React.FC<BillingToggleProps> = () => {
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex items-center space-x-2">
        <Label htmlFor="billing-cycle" className="font-semibold">
          Monthly Billing
        </Label>
      </div>
    </div>
  );
};

export default BillingToggle;
