
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface BillingToggleProps {
  billingCycle: 'monthly' | 'annually';
  setBillingCycle: (cycle: 'monthly' | 'annually') => void;
}

const BillingToggle: React.FC<BillingToggleProps> = ({ billingCycle, setBillingCycle }) => {
  const handleToggle = (checked: boolean) => {
    setBillingCycle(checked ? 'annually' : 'monthly');
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
      <Label htmlFor="billing-toggle" className={billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}>
        Monthly
      </Label>
      <Switch
        id="billing-toggle"
        checked={billingCycle === 'annually'}
        onCheckedChange={handleToggle}
      />
      <div className="flex items-center space-x-2">
        <Label htmlFor="billing-toggle" className={billingCycle === 'annually' ? 'font-semibold' : 'text-muted-foreground'}>
          Annual
        </Label>
        {billingCycle === 'annually' && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Save 10%
          </span>
        )}
      </div>
    </div>
  );
};

export default BillingToggle;
