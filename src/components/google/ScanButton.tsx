
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2, Scan } from 'lucide-react';

interface ScanButtonProps {
  onScan: () => void;
  isScanning: boolean;
  disabled: boolean;
  className?: string; // Add className prop for additional styling
}

const ScanButton: React.FC<ScanButtonProps> = ({ onScan, isScanning, disabled, className = '' }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    if (!disabled && !isScanning) {
      console.log('Scan button clicked, calling onScan');
      onScan();
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <Button 
        onClick={handleClick} 
        disabled={disabled || isScanning}
        className={`px-8 bg-blue-600 hover:bg-blue-700 text-white ${className}`}
        size="default"
        type="button" // Explicitly set type to button to avoid form submission
      >
        {isScanning ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Scan className="h-4 w-4 mr-2" />
            Scan Now
            <ChevronRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ScanButton;
