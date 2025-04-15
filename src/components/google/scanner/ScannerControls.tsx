
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleService } from '../types';
import { Industry } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';
import { Region } from '@/utils/types';
import { shouldUpgradeTier, recordScanUsage, getSubscription, hasScansRemaining } from '@/utils/paymentService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if user needs to upgrade using their user ID
    const checkSubscriptionStatus = () => {
      if (!user) return;
      
      const upgradeNeeded = shouldUpgradeTier(user.id);
      const hasScans = hasScansRemaining(user.id);
      
      setNeedsUpgrade(upgradeNeeded || !hasScans);
      
      if (upgradeNeeded) {
        toast.error('You have reached the scan limit for your current plan');
      } else if (!hasScans) {
        toast.error('You have no scans remaining in your plan');
      }
    };
    
    checkSubscriptionStatus();
  }, [user]);

  const handleStartScan = async () => {
    if (!user) {
      toast.error('Please sign in to continue');
      navigate('/sign-in');
      return;
    }

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
      // Record scan usage when starting a scan with user ID
      recordScanUsage(user.id);
      
      // Display remaining scans notification
      const subscription = getSubscription(user.id);
      if (subscription) {
        const scansRemaining = Math.max(0, subscription.scansLimit - subscription.scansUsed);
        toast.info(`Scan started. You have ${scansRemaining} scan${scansRemaining !== 1 ? 's' : ''} remaining this month.`);
      }
      
      await onScan(connectedServices, industry, language, region);
      
      // Check again after scan completes if user now needs to upgrade
      const nowNeedsUpgrade = shouldUpgradeTier(user.id);
      const hasScans = hasScansRemaining(user.id);
      
      if (nowNeedsUpgrade || !hasScans) {
        toast.warning('You have used all your available scans. Please upgrade your plan for more scans.');
        setNeedsUpgrade(true);
      }
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
