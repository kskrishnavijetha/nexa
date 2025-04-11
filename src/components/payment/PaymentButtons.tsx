
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { shouldUpgrade } from '@/utils/paymentService';

interface PaymentButtonsProps {
  onSuccess?: (paymentId: string) => void;
  tier: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  billingCycle: 'monthly' | 'annually';
}

const PaymentButtons: React.FC<PaymentButtonsProps> = ({
  onSuccess = () => {},
  tier,
  loading,
  setLoading,
  billingCycle
}) => {
  // For all tiers, use a regular button now
  const needsUpgrade = tier !== 'free' || shouldUpgrade();
  const buttonText = tier === 'free' 
    ? (needsUpgrade ? 'Select a Paid Plan' : 'Activate Free Plan')
    : `Subscribe to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`;
  
  return (
    <Button 
      className="w-full"
      disabled={loading}
      onClick={async () => {
        if (loading) return;
        setLoading(true);
        
        try {
          if (tier === 'free' && needsUpgrade) {
            // If they need to upgrade, just show paid plans
            toast.info('Please select a paid plan to continue');
            setLoading(false);
            return;
          }
          
          // Generate a simple subscription ID
          const subscriptionId = tier + '_' + Math.random().toString(36).substring(2, 15);
          toast.success(`${tier.charAt(0).toUpperCase() + tier.slice(1)} plan activated!`);
          onSuccess(subscriptionId);
        } catch (error) {
          toast.error(`Failed to activate ${tier} plan. Please try again.`);
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      {loading ? 'Processing...' : buttonText}
    </Button>
  );
};

export default PaymentButtons;
