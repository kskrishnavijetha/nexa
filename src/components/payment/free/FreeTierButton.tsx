
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveSubscription } from '@/utils/paymentService';

interface FreeTierButtonProps {
  tier: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: (paymentId: string) => void;
  needsUpgrade: boolean;
  billingCycle: 'monthly' | 'annually';
}

const FreeTierButton: React.FC<FreeTierButtonProps> = ({
  tier,
  loading,
  setLoading,
  onSuccess,
  needsUpgrade,
  billingCycle
}) => {
  const buttonText = needsUpgrade ? 'Select a Paid Plan' : 'Activate Free Plan';

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      if (tier === 'free' && needsUpgrade) {
        toast.info('Please select a paid plan to continue');
        setLoading(false);
        return;
      }
      
      const subscriptionId = tier + '_' + Math.random().toString(36).substring(2, 15);
      
      const result = await saveSubscription(tier, subscriptionId, billingCycle);
      
      if (result) {
        toast.success(`${tier.charAt(0).toUpperCase() + tier.slice(1)} plan activated!`);
        onSuccess(subscriptionId);
      } else {
        toast.error('Failed to activate plan. Please try again.');
      }
    } catch (error) {
      console.error('Error activating plan:', error);
      toast.error(`Failed to activate ${tier} plan. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      className="w-full"
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      {loading ? 'Processing...' : buttonText}
    </Button>
  );
};

export default FreeTierButton;
