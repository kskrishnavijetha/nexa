
import React from 'react';

interface PaymentPageHeaderProps {
  isRenewal?: boolean;
  isNewSignup?: boolean;
  isChangingPlan?: boolean;
}

const PaymentPageHeader: React.FC<PaymentPageHeaderProps> = ({ 
  isRenewal = false,
  isNewSignup = false,
  isChangingPlan = false
}) => {
  // Determine the header text based on the user's subscription status
  let headerText = "Choose Your Plan";
  let subText = "Select a subscription plan to continue";
  
  if (isChangingPlan) {
    headerText = "Change Your Plan";
    subText = "Select a new subscription plan";
  } else if (isRenewal) {
    headerText = "Renew Your Subscription";
    subText = "Your subscription has expired. Please renew to continue using all features.";
  } else if (isNewSignup) {
    headerText = "Choose Your Plan";
    subText = "Select a subscription plan to get started";
  }
  
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold mb-2">{headerText}</h2>
      <p className="text-muted-foreground">{subText}</p>
    </div>
  );
};

export default PaymentPageHeader;
