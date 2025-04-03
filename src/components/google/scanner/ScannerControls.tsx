
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleService } from '../types';
import { Industry } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';
import { Region } from '@/utils/types';

interface ScannerControlsProps {
  connectedServices: GoogleService[];
  isScanning: boolean;
  industry?: Industry;
  language?: SupportedLanguage;
  region?: Region;
  file?: File;
  onScan: (
    services: GoogleService[], 
    industry: Industry, 
    language?: SupportedLanguage, 
    region?: Region
  ) => Promise<void>;
  onScanComplete: (
    itemsScanned: number, 
    violationsFound: number
  ) => void;
}

const ScannerControls: React.FC<ScannerControlsProps> = ({
  connectedServices,
  isScanning,
  industry,
  language,
  region,
  file,
  onScan,
  onScanComplete
}) => {
  const handleStartScan = async () => {
    if (!industry) {
      toast.error('Please select an industry before scanning');
      return;
    }
    
    if (connectedServices.length === 0) {
      toast.error('Please connect at least one service before scanning');
      return;
    }
    
    try {
      await onScan(connectedServices, industry, language, region);
    } catch (error) {
      console.error('Error starting scan:', error);
      toast.error('Failed to complete scan');
    }
  };

  return (
    <Button 
      disabled={isScanning || connectedServices.length === 0 || !industry}
      className="w-full"
      onClick={handleStartScan}
    >
      {isScanning ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Scanning...
        </>
      ) : (
        'Start Compliance Scan'
      )}
    </Button>
  );
};

export default ScannerControls;
