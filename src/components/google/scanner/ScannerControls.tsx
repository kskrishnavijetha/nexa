
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleService } from '../types';
import { Industry } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';
import { Region } from '@/utils/types';
import { shouldUpgradeTier, recordScanUsage, getSubscription, hasActiveSubscription } from '@/utils/paymentService';
import { useNavigate } from 'react-router-dom';

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
  isCompactView: boolean;
}

const ScannerControls: React.FC<ScannerControlsProps> = ({
  connectedServices,
  isScanning,
  industry,
  language,
  region,
  file,
  onScan,
  onScanComplete,
  isCompactView
}) => {
  const navigate = useNavigate();
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  
  useEffect(() => {
    // Check if user needs to upgrade
    const subscription = getSubscription();
    
    // Only check for upgrade if user actually has a subscription
    // New users without a subscription should be able to scan
    if (subscription) {
      const upgradeNeeded = shouldUpgradeTier();
      setNeedsUpgrade(upgradeNeeded);
      
      if (upgradeNeeded) {
        toast.error('You have reached the scan limit for your current plan');
      }
    } else {
      setNeedsUpgrade(false);
    }
  }, []);

  const handleStartScan = async () => {
    if (needsUpgrade) {
      toast.error('Please upgrade your plan to continue scanning');
      navigate('/pricing');
      return;
    }
    
    if (!industry) {
      toast.error('Please select an industry before scanning');
      return;
    }
    
    if (connectedServices.length === 0) {
      toast.error('Please connect at least one service before scanning');
      return;
    }
    
    try {
      // Record scan usage when starting a scan
      recordScanUsage();
      
      // Display remaining scans notification
      const subscription = getSubscription();
      if (subscription) {
        const scansRemaining = subscription.scansLimit - subscription.scansUsed;
        toast.info(`Scan started. You have ${scansRemaining} scan${scansRemaining !== 1 ? 's' : ''} remaining this month.`);
      }
      
      await onScan(connectedServices, industry, language, region);
    } catch (error) {
      console.error('Error starting scan:', error);
      toast.error('Failed to complete scan');
    }
  };

  return (
    <Button 
      disabled={isScanning || connectedServices.length === 0 || !industry || needsUpgrade}
      className="w-full"
      onClick={handleStartScan}
    >
      {isScanning ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <span>Scanning...</span>
        </>
      ) : needsUpgrade ? (
        'Upgrade Plan to Scan'
      ) : (
        'Start Compliance Scan'
      )}
    </Button>
  );
};

export default ScannerControls;
