
import React from 'react';

// This component is now simplified since we only have monthly billing
const PaymentBillingToggle: React.FC = () => {
  return (
    <div className="flex items-center justify-center mb-4">
      <span className="font-semibold text-sm">Monthly Billing</span>
    </div>
  );
};

export default PaymentBillingToggle;
