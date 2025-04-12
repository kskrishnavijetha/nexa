
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { SlackScanOptions, SlackScanResults } from '@/utils/slack/types';
import { isSlackConnected, scanSlackMessages } from '@/utils/slack/slackService';
import { toast } from 'sonner';

interface SlackScanButtonProps {
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
  scanOptions: SlackScanOptions;
  setScanResults: (results: SlackScanResults | null) => void;
  setHasScanned: (value: boolean) => void;
  isRealTimeMonitoring: boolean;
}

const SlackScanButton: React.FC<SlackScanButtonProps> = ({
  isScanning,
  setIsScanning,
  scanOptions,
  setScanResults,
  setHasScanned,
  isRealTimeMonitoring
}) => {
  const handleScan = async () => {
    if (!isSlackConnected()) {
      toast.error('Please connect to Slack first');
      return;
    }
    
    setIsScanning(true);
    setScanResults(null);
    
    try {
      const results = await scanSlackMessages(scanOptions);
      setScanResults(results);
      setHasScanned(true);
      
      if (results.violations.length > 0) {
        toast.warning(`Found ${results.violations.length} compliance violations`);
      } else {
        toast.success('No compliance violations detected');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to scan Slack messages');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Button 
      onClick={handleScan} 
      disabled={isScanning || !isSlackConnected() || isRealTimeMonitoring}
      className="max-w-xs"
      size="lg"
    >
      {isScanning ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Scanning Slack Messages...
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4 mr-2" />
          Scan Slack for Violations
        </>
      )}
    </Button>
  );
};

export default SlackScanButton;
