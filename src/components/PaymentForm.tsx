
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Check, CreditCard } from 'lucide-react';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51NxSample1234567890StripeKeyABC');

interface PaymentFormProps {
  onSuccess?: (paymentId: string) => void;
}

const CheckoutForm = ({ onSuccess }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentType, setPaymentType] = useState<'one-time' | 'subscription'>('one-time');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, you would make an API call to your backend
      // to create a payment intent or subscription
      // Mock API call for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentMethod = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (paymentMethod.error) {
        toast.error(paymentMethod.error.message);
        return;
      }

      // Mock successful payment
      const mockPaymentId = 'pi_' + Math.random().toString(36).substring(2, 15);
      
      toast.success(
        paymentType === 'one-time' 
          ? 'Payment successful! Your compliance check will begin shortly.' 
          : 'Subscription activated! You now have unlimited compliance checks.'
      );
      
      if (onSuccess) {
        onSuccess(mockPaymentId);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const priceDisplay = paymentType === 'one-time' ? '$29.99' : '$99.99/month';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div 
            className={`relative flex-1 rounded-lg border p-4 cursor-pointer ${
              paymentType === 'one-time' 
                ? 'border-primary bg-primary/5' 
                : 'border-input'
            }`}
            onClick={() => setPaymentType('one-time')}
          >
            <div className="flex justify-between">
              <div className="font-medium">One-time Check</div>
              {paymentType === 'one-time' && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Single document compliance analysis
            </div>
            <div className="mt-2 font-semibold">$29.99</div>
          </div>
          
          <div 
            className={`relative flex-1 rounded-lg border p-4 cursor-pointer ${
              paymentType === 'subscription' 
                ? 'border-primary bg-primary/5' 
                : 'border-input'
            }`}
            onClick={() => setPaymentType('subscription')}
          >
            <div className="flex justify-between">
              <div className="font-medium">Subscription</div>
              {paymentType === 'subscription' && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Unlimited document scans
            </div>
            <div className="mt-2 font-semibold">$99.99/month</div>
          </div>
        </div>
      </div>

      <div className="rounded-md border p-4">
        <label className="block text-sm font-medium mb-2">
          Card Details
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          className="p-3 border rounded-md bg-background"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{priceDisplay}</span>
        </div>
        {paymentType === 'subscription' && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Billing</span>
            <span>Monthly</span>
          </div>
        )}
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{priceDisplay}</span>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="mr-2 h-4 w-4" />
        )}
        {loading 
          ? 'Processing...' 
          : `Pay ${priceDisplay}`
        }
      </Button>
    </form>
  );
};

const PaymentForm = (props: PaymentFormProps) => {
  return (
    <div className="max-w-md w-full mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Payment</h2>
        <p className="text-muted-foreground">
          Complete your payment to start analyzing documents
        </p>
      </div>
      
      <Elements stripe={stripePromise}>
        <CheckoutForm {...props} />
      </Elements>
    </div>
  );
};

export default PaymentForm;
