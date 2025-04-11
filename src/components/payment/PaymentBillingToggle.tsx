
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaymentBillingToggleProps {
  billingCycle: 'monthly' | 'annually';
  setBillingCycle: (cycle: 'monthly' | 'annually') => void;
}

const PaymentBillingToggle: React.FC<PaymentBillingToggleProps> = ({ 
  billingCycle, 
  setBillingCycle 
}) => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-4">
      <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold' : ''}`}>Monthly</span>
      <Button
        variant="outline"
        size="sm"
        className={`relative px-8 h-7 ${billingCycle === 'annually' ? 'bg-primary/10' : ''}`}
        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
      >
        <div
          className={`absolute top-1 bottom-1 left-1 w-6 bg-primary rounded-sm transition-transform ${
            billingCycle === 'annually' ? 'translate-x-[calc(100%-2px)]' : ''
          }`}
        />
        <span className="sr-only">Toggle</span>
      </Button>
      <span className={`text-sm ${billingCycle === 'annually' ? 'font-semibold' : ''}`}>
        Annually <span className="text-xs text-green-600">(Save 10%)</span>
      </span>
    </div>
  );
};

export default PaymentBillingToggle;
