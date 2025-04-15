
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Calendar, CheckCircle } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { SubscriptionInfo } from '@/utils/paymentService';

interface SubscriptionStatusProps {
  subscription: SubscriptionInfo;
  onRenew: () => void;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ subscription, onRenew }) => {
  const isActive = subscription.active;
  const formattedExpiry = formatDistance(new Date(subscription.expirationDate), new Date(), { addSuffix: true });
  
  const getPlanName = () => {
    const planName = subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
    return `${planName} ${subscription.billingCycle || 'Monthly'} Plan`;
  };
  
  // Calculate remaining scans correctly
  const scansRemaining = Math.max(0, subscription.scansLimit - subscription.scansUsed);
  const isLimitReached = scansRemaining <= 0;
  
  return (
    <Card className={`mb-8 ${!isActive ? 'border-amber-200 bg-amber-50' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle>
          {getPlanName()}
          {!isActive && <span className="ml-2 text-amber-600 text-sm">(Inactive)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className={isActive ? 'text-green-600' : 'text-amber-600'}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Scans:</span>
            <span className={isLimitReached ? 'text-amber-600' : ''}>
              {scansRemaining} / {subscription.scansLimit} remaining
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Expiration:</span>
            <span className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {formattedExpiry}
            </span>
          </div>
        </div>
      </CardContent>
      {!isActive && (
        <CardFooter className="pt-0">
          <Button onClick={onRenew} variant="outline" className="w-full">
            Renew Subscription
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SubscriptionStatus;
