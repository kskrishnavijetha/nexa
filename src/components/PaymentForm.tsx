
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Check } from 'lucide-react';
import { createSubscription } from '@/utils/paymentService';

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

const PayPalButton = ({ onSuccess, tier, loading, setLoading }: { 
  onSuccess: (paymentId: string) => void, 
  tier: keyof typeof pricingTiers,
  loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  useEffect(() => {
    // In a real app, you would load the PayPal SDK here
    const mockPayPalButton = document.getElementById('paypal-button-container');
    if (mockPayPalButton) {
      mockPayPalButton.onclick = async () => {
        if (loading) return;
        setLoading(true);
        
        try {
          // For free tier, just show success message without processing payment
          if (tier === 'free') {
            const mockPaymentId = 'free_' + Math.random().toString(36).substring(2, 15);
            toast.success('Free plan activated!');
            onSuccess(mockPaymentId);
            setLoading(false);
            return;
          }
          
          // For paid tiers, use the subscription service
          const result = await createSubscription('mock_payment_method', `price_${tier}`);
          
          if (result.success) {
            toast.success(`${pricingTiers[tier].name} plan activated! You now have access to ${pricingTiers[tier].scans} compliance scans per month.`);
            onSuccess(result.paymentId || 'unknown');
          } else {
            toast.error(result.error || 'Payment failed. Please try again.');
          }
        } catch (error) {
          toast.error('PayPal payment failed. Please try again.');
        } finally {
          setLoading(false);
        }
      };
    }
  }, [tier, onSuccess, loading, setLoading]);

  // For free tier, change button text
  const buttonText = tier === 'free' ? 'Activate Free Plan' : `Subscribe with PayPal - $${pricingTiers[tier].price}/month`;

  return (
    <Button 
      id="paypal-button-container"
      className="w-full bg-[#0070ba] hover:bg-[#003087]" 
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        tier !== 'free' && (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.15 5.9c.2 1.16.11 2-.3 2.9-.53 1.2-1.5 2.06-2.82 2.7-.09.05-.19.09-.28.13H16.74c-1.33.64-2.8.92-4.3.92h-.32c-.24 0-.48-.05-.71-.1-.5 2.3-1 4.58-1.5 6.87-.04.18-.1.27-.3.27H6.18c-.22 0-.31-.09-.27-.3.48-2.17.96-4.35 1.44-6.52.08-.37.16-.73.25-1.1L8.1 9.4c.06-.25.12-.3.38-.3h4.22c.9 0 1.7-.26 2.34-.85.47-.43.78-.96.93-1.6.05-.22.02-.3-.2-.3h-3.95c-.25 0-.32-.07-.32-.32 0-.64.01-1.27 0-1.9 0-.2.06-.3.27-.3h5.18c.36 0 .7-.04 1.03-.17 1.42-.57 2.5-1.5 3.17-2.9v4.14z"/>
            <path d="M3.37 18.48c-.36-.12-.47-.42-.35-.77.05-.15.11-.3.18-.44 1.77-3.77 3.55-7.54 5.33-11.3.15-.31.4-.47.76-.47h2.9c-.15.34-.31.66-.45.99-1.69 3.56-3.37 7.13-5.05 10.7-.18.4-.5.63-.93.63H3.52c-.05 0-.1 0-.15-.02v.68z"/>
          </svg>
        )
      )}
      {loading ? 'Processing...' : buttonText}
    </Button>
  );
};

const CheckoutForm = ({ onSuccess }: PaymentFormProps) => {
  const [selectedTier, setSelectedTier] = useState<keyof typeof pricingTiers>('free');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // PayPal button handles the payment processing
    const paypalButton = document.getElementById('paypal-button-container');
    if (paypalButton) {
      paypalButton.click();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <PayPalButton 
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
    </form>
  );
};

const PaymentForm = (props: PaymentFormProps) => {
  return (
    <div className="max-w-md w-full mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Select a subscription plan to start analyzing documents
        </p>
      </div>
      
      <CheckoutForm {...props} />
    </div>
  );
};

export default PaymentForm;
