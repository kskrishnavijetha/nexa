
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { SubscriptionInfo, getSubscription } from '@/utils/paymentService';

interface SubscriptionStatusProps {
  onRenew: () => void;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ onRenew }) => {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchSubscription() {
      try {
        const sub = await getSubscription();
        setSubscription(sub);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSubscription();
  }, []);
  
  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="py-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading subscription info...</span>
        </CardContent>
      </Card>
    );
  }
  
  if (!subscription) {
    return (
      <Card className="mb-8 border-amber-200 bg-amber-50">
        <CardContent className="py-6">
          <p className="text-center text-amber-600">No subscription information available</p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button onClick={onRenew} variant="outline" className="w-full">
            Select a Plan
          </Button>
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
