
import React from 'react';
import { hasActiveSubscription } from '@/utils/paymentService';

interface PaymentPageHeaderProps {
  isRenewal: boolean;
}

const PaymentPageHeader: React.FC<PaymentPageHeaderProps> = ({ isRenewal }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold">
        {isRenewal ? 'Renew Your Subscription' : (hasActiveSubscription() ? 'Manage Your Subscription' : 'Choose Your Plan')}
      </h2>
      <p className="text-muted-foreground">
        Select a subscription plan to start analyzing documents
      </p>
    </div>
  );
};

export default PaymentPageHeader;
