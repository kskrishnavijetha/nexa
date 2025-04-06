
import React from 'react';

interface PaymentPageHeaderProps {
  isRenewal: boolean;
  isNewSignup?: boolean;
}

const PaymentPageHeader: React.FC<PaymentPageHeaderProps> = ({ isRenewal, isNewSignup }) => {
  let title = 'Choose Your Subscription Plan';
  let description = 'Select the plan that best fits your compliance needs.';

  if (isRenewal) {
    title = 'Renew Your Subscription';
    description = 'Your subscription has expired. Please renew to continue using all features.';
  } else if (isNewSignup) {
    title = 'Complete Your Registration';
    description = 'Choose a subscription plan to get started with Nexabloom.';
  }

  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
};

export default PaymentPageHeader;
