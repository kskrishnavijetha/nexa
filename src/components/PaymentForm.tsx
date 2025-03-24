
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Check } from 'lucide-react';
import { 
  createSubscription, 
  getSubscription, 
  loadPayPalScript,
  createPayPalButtons
} from '@/utils/paymentService';

interface PaymentFormProps {
  onSuccess?: (paymentId: string) => void;
}

// Define pricing tiers
const pricingTiers = {
  free: { name: 'Free', price: 0, scans: 1, monthly: true },
  basic: { name: 'Basic', price: 29, scans: 10, monthly: true },
  pro: { name: 'Pro', price: 99, scans: 50, monthly: true },
  enterprise: { name: 'Enterprise', price: 299, scans: 'Unlimited', monthly: true },
};

const PayPalButtonContainer = ({ onSuccess, tier, loading, setLoading }: { 
  onSuccess: (paymentId: string) => void, 
  tier: keyof typeof pricingTiers,
  loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // For free tier, create a custom button instead of PayPal
    if (tier === 'free') {
      return;
    }
    
    // Load PayPal script
    const initializePayPal = async () => {
      try {
        await loadPayPalScript();
        
        // Create PayPal buttons
        createPayPalButtons(
          'paypal-button-container',
          tier,
          // On approve handler
          async (data) => {
            setLoading(true);
            try {
              // Call your backend to verify and record the subscription
              const result = await createSubscription('paypal_subscription', `price_${tier}`);
              if (result.success) {
                toast.success(`${pricingTiers[tier].name} plan activated! You now have access to ${pricingTiers[tier].scans} compliance scans per month.`);
                onSuccess(result.paymentId || data.subscriptionID || 'unknown');
              } else {
                toast.error(result.error || 'Payment failed. Please try again.');
              }
            } catch (error) {
              toast.error('Failed to process subscription. Please try again.');
              console.error('Subscription error:', error);
            } finally {
              setLoading(false);
            }
          },
          // On error handler
          (err) => {
            console.error('PayPal error:', err);
            toast.error('PayPal payment failed. Please try again.');
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Failed to load PayPal:', error);
        toast.error('Failed to load PayPal. Please try again later.');
      }
    };
    
    if (!loading) {
      initializePayPal();
    }
    
    // Cleanup function
    return () => {
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = '';
      }
    };
  }, [tier, onSuccess, loading, setLoading]);
  
  // For free tier, use a regular button
  if (tier === 'free') {
    return (
      <Button 
        className="w-full"
        disabled={loading}
        onClick={async () => {
          if (loading) return;
          setLoading(true);
          
          try {
            const result = await createSubscription('mock_payment_method', `price_${tier}`);
            if (result.success) {
              toast.success('Free plan activated!');
              onSuccess(result.paymentId || 'unknown');
            } else {
              toast.error(result.error || 'Failed to activate free plan. Please try again.');
            }
          } catch (error) {
            toast.error('Failed to activate free plan. Please try again.');
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {loading ? 'Processing...' : 'Activate Free Plan'}
      </Button>
    );
  }
  
  // For paid plans, render the PayPal button container
  return (
    <div 
      id="paypal-button-container" 
      ref={paypalContainerRef}
      className="w-full min-h-[40px]"
    >
      {loading && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Loading PayPal...</span>
        </div>
      )}
    </div>
  );
};

const CheckoutForm = ({ onSuccess }: PaymentFormProps) => {
  const [selectedTier, setSelectedTier] = useState<keyof typeof pricingTiers>('free');
  const [loading, setLoading] = useState(false);
  const currentSubscription = getSubscription();
  
  // If user has an existing subscription (even if expired), preselect that tier
  useEffect(() => {
    if (currentSubscription && pricingTiers[currentSubscription.plan as keyof typeof pricingTiers]) {
      setSelectedTier(currentSubscription.plan as keyof typeof pricingTiers);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select a Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(pricingTiers).map(([key, tier]) => (
            <div 
              key={key}
              className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                selectedTier === key 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-input hover:border-primary/50'
              }`}
              onClick={() => setSelectedTier(key as keyof typeof pricingTiers)}
            >
              <div className="flex justify-between">
                <div className="font-medium">{tier.name}</div>
                {selectedTier === key && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {tier.scans} {typeof tier.scans === 'number' ? 'scans' : ''} per month
              </div>
              <div className="mt-2 font-semibold">
                {tier.price === 0 ? 'Free' : `$${tier.price}/month`}
              </div>
            </div>
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

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Plan</span>
          <span>{pricingTiers[selectedTier].name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Scans per month</span>
          <span>{pricingTiers[selectedTier].scans}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Billing</span>
          <span>{selectedTier === 'free' ? 'No billing' : 'Monthly'}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{selectedTier === 'free' ? 'Free' : `$${pricingTiers[selectedTier].price}/month`}</span>
        </div>
      </div>
    </div>
  );
};

const PaymentForm = (props: PaymentFormProps) => {
  return (
    <div className="max-w-md w-full mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {getSubscription()?.active ? 'Change Your Plan' : 'Choose Your Plan'}
        </h2>
        <p className="text-muted-foreground">
          Select a subscription plan to start analyzing documents
        </p>
      </div>
      
      <CheckoutForm {...props} />
    </div>
  );
};

export default PaymentForm;
