
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Calendar, CheckCircle, Infinity } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { SubscriptionInfo } from '@/utils/paymentService';

interface SubscriptionStatusProps {
  subscription: SubscriptionInfo;
  onRenew: () => void;
  onChangePlan: () => void;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ 
  subscription, 
  onRenew,
  onChangePlan 
}) => {
  const isActive = subscription.active;
  const isLifetime = subscription.isLifetime || subscription.billingCycle === 'lifetime';
  const isPaidPlan = subscription.plan !== 'free';
  
  // Handle expiry display differently for lifetime subscriptions
  const formattedExpiry = isLifetime 
    ? 'Never expires' 
    : formatDistance(new Date(subscription.expirationDate), new Date(), { addSuffix: true });
  
  const getPlanName = () => {
    if (isLifetime) {
      return 'Lifetime Access Plan';
    }
    
    const planName = subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
    return `${planName} ${subscription.billingCycle || 'Monthly'} Plan`;
  };
  
  // Calculate remaining scans correctly
  const scansRemaining = isLifetime 
    ? 'Unlimited' 
    : Math.max(0, subscription.scansLimit - subscription.scansUsed);
  
  // Fixed: Only check isLimitReached when scansRemaining is a number, not when it's "Unlimited"
  const isLimitReached = !isLifetime && typeof scansRemaining === 'number' && scansRemaining <= 0;
  
  return (
    <Card className={`mb-8 ${!isActive ? 'border-amber-200 bg-amber-50' : (isLifetime ? 'border-emerald-200 bg-emerald-50' : '')}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          {getPlanName()}
          {isLifetime && <Infinity className="ml-2 h-5 w-5 text-emerald-600" />}
          {!isActive && <span className="ml-2 text-amber-600 text-sm">(Inactive)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className={isActive ? (isLifetime ? 'text-emerald-600' : 'text-green-600') : 'text-amber-600'}>
              {isActive ? (isLifetime ? 'Lifetime Access' : 'Active') : 'Inactive'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Scans:</span>
            <span className={isLimitReached ? 'text-amber-600' : (isLifetime ? 'text-emerald-600 font-medium' : '')}>
              {isLifetime ? 'Unlimited' : `${scansRemaining} / ${subscription.scansLimit} remaining`}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Expiration:</span>
            <span className="flex items-center">
              {isLifetime ? (
                <Award className="mr-1 h-4 w-4 text-emerald-600" />
              ) : (
                <Calendar className="mr-1 h-4 w-4" />
              )}
              {formattedExpiry}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        {!isActive && !isLifetime && (
          <Button onClick={onRenew} variant="outline" className="w-full">
            Renew Subscription
          </Button>
        )}
        
        {isActive && isPaidPlan && !isLifetime && (
          <Button onClick={onChangePlan} variant="outline" className="w-full">
            Change Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionStatus;
