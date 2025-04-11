
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { saveSubscription } from '@/utils/paymentService';
import { toast } from 'sonner';
import { shouldUpgrade } from '@/utils/paymentService';

interface FreePlanButtonProps {
  onSuccess?: (paymentId: string) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const FreePlanButton: React.FC<FreePlanButtonProps> = ({
  onSuccess = () => {},
  loading,
  setLoading
}) => {
  const needsUpgrade = shouldUpgrade();
  const buttonText = needsUpgrade ? 'Select a Paid Plan' : 'Activate Free Plan';
  
  const handleActivateFree = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      if (needsUpgrade) {
        // If they need to upgrade, just show paid plans
        toast.info('Please select a paid plan to continue');
        setLoading(false);
        return;
      }
      
      // For free tier, just create a local subscription record
      const subscriptionId = 'free_' + Math.random().toString(36).substring(2, 15);
      saveSubscription('free', subscriptionId, 'monthly');
      toast.success('Free plan activated!');
      onSuccess(subscriptionId);
    } catch (error) {
      toast.error('Failed to activate free plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      className="w-full"
      disabled={loading}
      onClick={handleActivateFree}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" data-testid="loading-spinner" />
      ) : null}
      {loading ? 'Processing...' : buttonText}
    </Button>
  );
};

export default FreePlanButton;
