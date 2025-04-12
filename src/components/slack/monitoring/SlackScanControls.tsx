
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Play, RefreshCw, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SlackScanOptions, SlackScanResults } from '@/utils/slack/types';
import { scanSlackMessages, isSlackConnected } from '@/utils/slack/slackService';
import { startRealTimeMonitoring, stopRealTimeMonitoring } from '@/utils/slack/realTimeMonitoring';
import SlackScanHistoryButton from '../SlackScanHistoryButton';

interface SlackScanControlsProps {
  scanOptions: SlackScanOptions;
  isScanning: boolean;
  setIsScanning: (isScanning: boolean) => void;
  setScanResults: (results: SlackScanResults | null) => void;
  setHasScanned: (hasScanned: boolean) => void;
  isRealTimeMonitoring: boolean;
  setIsRealTimeMonitoring: (isMonitoring: boolean) => void;
  setRealTimeViolations: (violations: any[]) => void;
  setLastUpdated: (date: Date | null) => void;
}

const SlackScanControls: React.FC<SlackScanControlsProps> = ({
  scanOptions,
  isScanning,
  setIsScanning,
  setScanResults,
  setHasScanned,
  isRealTimeMonitoring,
  setIsRealTimeMonitoring,
  setRealTimeViolations,
  setLastUpdated
}) => {
  const handleScanClick = async () => {
    if (!isSlackConnected()) {
      toast.error('Please connect your Slack workspace first');
      return;
    }

    if (scanOptions.channels.length === 0) {
      toast.error('Please select at least one channel to scan');
      return;
    }

    setIsScanning(true);
    setScanResults(null);

    try {
      // Run the scan
      const results = await scanSlackMessages(scanOptions);
      setScanResults(results);
      setHasScanned(true);
      
      if (results.status === 'completed') {
        toast.success(
          `Scan completed: ${results.violations.length} violations found in ${results.scannedMessages} messages`,
          {
            description: 'Check the violations tab for details',
            duration: 5000
          }
        );
      } else {
        toast.error('Scan failed. Please try again.');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to scan messages. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleStartRealTimeMonitoring = () => {
    if (!isSlackConnected()) {
      toast.error('Please connect your Slack workspace first');
      return;
    }

    if (scanOptions.channels.length === 0) {
      toast.error('Please select at least one channel to monitor');
      return;
    }

    setIsRealTimeMonitoring(true);
    setLastUpdated(new Date());

    startRealTimeMonitoring({
      options: scanOptions,
      onViolationDetected: (violations) => {
        setRealTimeViolations(violations);
        setLastUpdated(new Date());
      },
      onError: (error) => {
        console.error('Real-time monitoring error:', error);
        toast.error('Error in real-time monitoring');
      }
    });

    toast.success('Real-time monitoring started', {
      description: 'Monitoring channels for compliance violations'
    });
  };

  const handleStopRealTimeMonitoring = () => {
    setIsRealTimeMonitoring(false);
    stopRealTimeMonitoring();
    
    toast.info('Real-time monitoring stopped', {
      description: 'Channel monitoring has been paused'
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {!isRealTimeMonitoring && (
        <Button
          variant="default"
          disabled={isScanning}
          onClick={handleScanClick}
          className="gap-1"
        >
          {isScanning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Run Scan</span>
            </>
          )}
        </Button>
      )}

      {isRealTimeMonitoring ? (
        <Button
          variant="destructive"
          onClick={handleStopRealTimeMonitoring}
          className="gap-1"
        >
          <StopCircle className="h-4 w-4" />
          <span>Stop Monitoring</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          disabled={isScanning}
          onClick={handleStartRealTimeMonitoring}
          className="gap-1"
        >
          <AlertCircle className="h-4 w-4" />
          <span>Start Real-Time Monitoring</span>
        </Button>
      )}

      <SlackScanHistoryButton hasScanned={!isScanning} />
    </div>
  );
};

export default SlackScanControls;
