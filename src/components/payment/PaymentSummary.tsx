
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PaymentSummaryProps {
  selectedTier: string;
  billingCycle: 'monthly' | 'annually';
  getPrice: (tier: string, cycle: 'monthly' | 'annually') => number;
  changePlan?: boolean;
  currentPlan?: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ 
  selectedTier, 
  billingCycle, 
  getPrice,
  changePlan,
  currentPlan
}) => {
  // Regular subscription tiers
  const price = getPrice(selectedTier, billingCycle);
  const discount = selectedTier !== 'free' && billingCycle === 'annually' ? 10 : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Plan
          </span>
          <span className="font-medium">${price}</span>
        </div>
        
        {selectedTier !== 'free' && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Billing cycle</span>
            <span className="font-medium capitalize">{billingCycle}</span>
          </div>
        )}
        
        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-green-600">Annual discount</span>
            <span className="font-medium text-green-600">-{discount}%</span>
          </div>
        )}
        
        <div className={cn("border-t pt-4 mt-2", selectedTier === 'free' && "hidden")}>
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span className="text-xl">${price}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {billingCycle === 'monthly' 
              ? 'Billed monthly. Cancel anytime.' 
              : 'Billed annually. Save 10% compared to monthly billing.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
