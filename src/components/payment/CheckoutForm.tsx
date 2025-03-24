
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getSubscription } from '@/utils/paymentService';
import PlanSelector from './PlanSelector';
import PayPalButtonContainer from './PayPalButtonContainer';
import OrderSummary from './OrderSummary';
import { pricingTiers } from './PricingTiers';

interface CheckoutFormProps {
  onSuccess?: (paymentId: string) => void;
}

const CheckoutForm = ({ onSuccess }: CheckoutFormProps) => {
  const [selectedTier, setSelectedTier] = useState<keyof typeof pricingTiers>('free');
  const currentSubscription = getSubscription();
  
  // If user has an existing subscription (even if expired), preselect that tier
  useEffect(() => {
    if (currentSubscription && pricingTiers[currentSubscription.plan as keyof typeof pricingTiers]) {
      setSelectedTier(currentSubscription.plan as keyof typeof pricingTiers);
    }
  }, []);

  return (
    <div className="space-y-6">
      <PlanSelector 
        selectedTier={selectedTier} 
        setSelectedTier={setSelectedTier} 
      />

      <div className="rounded-md border p-4 bg-slate-50">
        <p className="text-sm text-muted-foreground mb-4">
          {selectedTier === 'free' 
            ? 'Activate your free plan to start analyzing documents'
            : 'Set up your subscription with PayPal for quick and secure payments.'
          }
        </p>
        <PayPalButtonContainer 
          onSuccess={onSuccess || (() => {})}
          tier={selectedTier}
        />
      </div>

      <OrderSummary selectedTier={selectedTier} />
    </div>
  );
};

export default CheckoutForm;
