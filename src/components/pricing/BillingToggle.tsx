
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface BillingToggleProps {
  billingCycle: 'monthly' | 'annually';
  onChange: (billingCycle: 'monthly' | 'annually') => void;
}

const BillingToggle: React.FC<BillingToggleProps> = ({ billingCycle, onChange }) => {
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex items-center space-x-2">
        <Label 
          htmlFor="billing-cycle" 
          className={billingCycle === 'monthly' ? 'font-semibold' : ''}
        >
          Monthly
        </Label>
        <Switch 
          id="billing-cycle" 
          checked={billingCycle === 'annually'}
          onCheckedChange={(checked) => onChange(checked ? 'annually' : 'monthly')}
        />
        <Label 
          htmlFor="billing-cycle" 
          className={billingCycle === 'annually' ? 'font-semibold' : ''}
        >
          Annually <span className="text-sm text-green-600 font-semibold">(Save 10%)</span>
        </Label>
      </div>
    </div>
  );
};

export default BillingToggle;
