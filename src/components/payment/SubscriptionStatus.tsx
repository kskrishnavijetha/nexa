
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
  // Special display for lifetime subscriptions
  if (subscription.isLifetime) {
    return (
      <Card className="mb-8 border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-green-900">
            <Award className="mr-2 h-5 w-5" /> 
            Lifetime Access Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center text-green-800">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              <span>Unlimited scans available</span>
            </div>
            <div className="flex items-center text-green-800">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              <span>All premium features unlocked</span>
            </div>
            <div className="flex items-center text-green-800">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              <span>Never expires</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-3">
          <p className="text-sm text-green-700">
            Thank you for your lifetime membership! You have full, unlimited access to all features.
          </p>
        </CardFooter>
      </Card>
    );
  }

  const isActive = subscription.active;
  const formattedExpiry = formatDistance(new Date(subscription.expirationDate), new Date(), { addSuffix: true });
  
  const getPlanName = () => {
    const planName = subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
    return `${planName} ${subscription.billingCycle || 'Monthly'} Plan`;
  };
  
  const scansRemaining = subscription.scansLimit - subscription.scansUsed;
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
              {subscription.scansUsed} / {subscription.scansLimit} used
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
