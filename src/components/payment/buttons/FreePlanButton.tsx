
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { shouldUpgrade } from '@/utils/paymentService';

interface FreePlanButtonProps {
  onActivate: () => void;
  loading: boolean;
}

const FreePlanButton: React.FC<FreePlanButtonProps> = ({ onActivate, loading }) => {
  const needsUpgrade = shouldUpgrade();
  const buttonText = needsUpgrade ? 'Select a Paid Plan' : 'Activate Free Plan';
  
  return (
    <Button 
      className="w-full"
      disabled={loading}
      onClick={onActivate}
      aria-label={buttonText}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      {loading ? 'Processing...' : buttonText}
    </Button>
  );
};

export default FreePlanButton;
