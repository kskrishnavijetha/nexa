
import React from 'react';
import { Button } from '@/components/ui/button';
import { SubscriptionInfo } from '@/utils/paymentService';
import { shouldUpgrade } from '@/utils/paymentService';
import { AlertTriangle } from 'lucide-react';

interface SubscriptionStatusProps {
  subscription: SubscriptionInfo;
  onRenew: () => void;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ subscription, onRenew }) => {
  if (!subscription) return null;
  
  const expirationDate = new Date(subscription.expirationDate);
  const formattedDate = expirationDate.toLocaleDateString();
  const needsUpgrade = shouldUpgrade();
  
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
      
      {needsUpgrade && subscription.plan === 'free' && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 font-medium">Free plan limit reached</p>
            <p className="text-sm text-amber-700 mt-1">
              {subscription.scansUsed >= subscription.scansLimit 
                ? "You've used all available scans in your free plan." 
                : "Your free plan has expired."}
              {" "}Please upgrade to continue using CompliZen.
            </p>
          </div>
        </div>
      )}
      
      {(!subscription.active || needsUpgrade) && (
        <div className="mt-4">
          {!needsUpgrade && (
            <p className="text-amber-600 mb-2">Your subscription has expired. Please renew to continue using CompliZen.</p>
          )}
          <Button 
            onClick={onRenew} 
            className="w-full"
          >
            {subscription.plan === 'free' ? 'Upgrade Plan' : 'Renew Subscription'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
