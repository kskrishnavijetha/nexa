
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FreeButtonProps {
  loading: boolean;
  needsUpgrade: boolean;
  onActivate: () => void;
  buttonText: string;
}

const FreeButton: React.FC<FreeButtonProps> = ({
  loading,
  needsUpgrade,
  onActivate,
  buttonText
}) => {
  return (
    <Button 
      className="w-full"
      disabled={loading}
      onClick={onActivate}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      {loading ? 'Processing...' : buttonText}
    </Button>
  );
};

export default FreeButton;
