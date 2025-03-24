
import React from 'react';
import { Button } from '@/components/ui/button';
import { SubscriptionInfo } from '@/utils/payment/types';

interface SubscriptionStatusProps {
  subscription: SubscriptionInfo;
  setIsRenewal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUpgrading: React.Dispatch<React.SetStateAction<boolean>>;
  isUpgrading: boolean;
}

const SubscriptionStatus = ({ 
  subscription, 
  setIsRenewal, 
  setIsUpgrading,
  isUpgrading 
}: SubscriptionStatusProps) => {
  if (!subscription) return null;
  
  const expirationDate = new Date(subscription.expirationDate);
  const formattedDate = expirationDate.toLocaleDateString();
  
  return (
    <div className="bg-muted/30 p-6 rounded-lg mb-8">
      <h3 className="text-lg font-medium mb-2">Your Current Subscription</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Plan:</span>
          <span className="font-medium capitalize">{subscription.plan}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className={`font-medium ${subscription.active ? 'text-green-600' : 'text-red-600'}`}>
            {subscription.active ? 'Active' : 'Expired'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Scans used:</span>
          <span>{subscription.scansUsed} of {subscription.scansLimit === 999 ? 'Unlimited' : subscription.scansLimit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Expires on:</span>
          <span>{formattedDate}</span>
        </div>
      </div>
      
      {!subscription.active && (
        <div className="mt-4">
          <p className="text-amber-600 mb-2">Your subscription has expired. Please renew to continue using CompliZen.</p>
          <Button 
            onClick={() => setIsRenewal(true)} 
            className="w-full"
          >
            Renew Subscription
          </Button>
        </div>
      )}
      
      {isUpgrading && subscription.active && subscription.plan === 'free' && (
        <div className="mt-4">
          <p className="text-amber-600 mb-2">You've used all your free scans. Upgrade for more features and scans!</p>
          <Button 
            onClick={() => setIsUpgrading(true)} 
            className="w-full"
          >
            Upgrade Your Plan
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
