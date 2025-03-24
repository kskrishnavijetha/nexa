
import React, { useState, useEffect } from 'react';
import { getSubscription } from '@/utils/paymentService';
import PayPalButtonContainer from './PayPalButtonContainer';
import PricingTier, { PricingTierKey, pricingTiers } from './PricingTier';
import OrderSummary from './OrderSummary';

interface CheckoutFormProps {
  onSuccess?: (paymentId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const [selectedTier, setSelectedTier] = useState<PricingTierKey>('free');
  const [loading, setLoading] = useState(false);
  const currentSubscription = getSubscription();
  
  // If user has an existing subscription (even if expired), preselect that tier
  useEffect(() => {
    if (currentSubscription && pricingTiers[currentSubscription.plan as PricingTierKey]) {
      setSelectedTier(currentSubscription.plan as PricingTierKey);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select a Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(pricingTiers).map(([key]) => (
            <PricingTier
              key={key}
              tierKey={key as PricingTierKey}
              isSelected={selectedTier === key}
              onClick={() => setSelectedTier(key as PricingTierKey)}
            />
          ))}
        </div>
      </div>

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
          loading={loading}
          setLoading={setLoading}
        />
      </div>

      <OrderSummary selectedTier={selectedTier} />
    </div>
  );
};

export default CheckoutForm;
