
import React from 'react';

// This component is now simplified since we only have monthly billing
const BillingToggle: React.FC = () => {
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex items-center space-x-2">
        <span className="font-semibold">Monthly Billing</span>
      </div>
    </div>
  );
};

export default BillingToggle;
