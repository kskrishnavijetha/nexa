
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface PaymentBillingToggleProps {
  billingCycle: 'monthly' | 'annually';
  setBillingCycle: (cycle: 'monthly' | 'annually') => void;
  disabled?: boolean;
}

const PaymentBillingToggle: React.FC<PaymentBillingToggleProps> = ({ 
  billingCycle, 
  setBillingCycle,
  disabled = false 
}) => {
  const isAnnually = billingCycle === 'annually';
  
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
      <div>
        <h4 className="text-sm font-medium">Billing Cycle</h4>
        <p className="text-xs text-muted-foreground">
          {isAnnually ? 'Save 10% with annual billing' : 'Billed monthly'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Monthly</span>
        <Switch
          checked={isAnnually}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')}
          disabled={disabled}
        />
        <span className="text-sm">Annually</span>
      </div>
    </div>
  );
};

export default PaymentBillingToggle;
