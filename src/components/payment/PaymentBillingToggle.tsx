
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface PaymentBillingToggleProps {
  billingCycle: 'monthly';
  setBillingCycle: (cycle: 'monthly') => void;
  disabled?: boolean;
}

const PaymentBillingToggle: React.FC<PaymentBillingToggleProps> = ({ 
  disabled = false 
}) => {
  // Only monthly billing available
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
      <div>
        <h4 className="text-sm font-medium">Billing Cycle</h4>
        <p className="text-xs text-muted-foreground">
          Billed monthly
        </p>
      </div>
    </div>
  );
};

export default PaymentBillingToggle;
