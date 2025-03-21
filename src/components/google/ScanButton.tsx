
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';

interface ScanButtonProps {
  onScan: () => void;
  isScanning: boolean;
  disabled: boolean;
}

const ScanButton: React.FC<ScanButtonProps> = ({ onScan, isScanning, disabled }) => {
  return (
    <div className="flex justify-center mt-4">
      <Button 
        onClick={onScan} 
        disabled={disabled || isScanning}
        className="px-8"
      >
        {isScanning ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            Scan Now
            <ChevronRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ScanButton;
