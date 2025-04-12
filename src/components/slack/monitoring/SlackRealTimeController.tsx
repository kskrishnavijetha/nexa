
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, ZapOff } from 'lucide-react';
import { SlackScanOptions, SlackViolation } from '@/utils/slack/types';
import { scanSlackMessages } from '@/utils/slack/slackService';
import { toast } from 'sonner';
import { isSlackConnected } from '@/utils/slack/slackAuth';

interface SlackRealTimeControllerProps {
  isRealTimeMonitoring: boolean;
  setIsRealTimeMonitoring: (value: boolean) => void;
  scanOptions: SlackScanOptions;
  setRealTimeViolations: React.Dispatch<React.SetStateAction<SlackViolation[]>>;
  setLastUpdated: React.Dispatch<React.SetStateAction<Date | null>>;
  isScanning: boolean;
}

const SlackRealTimeController: React.FC<SlackRealTimeControllerProps> = ({
  isRealTimeMonitoring,
  setIsRealTimeMonitoring,
  scanOptions,
  setRealTimeViolations,
  setLastUpdated,
  isScanning
}) => {
  const monitoringIntervalRef = useRef<number | null>(null);

  const performRealTimeScan = async () => {
    try {
      // Use a more limited scope for real-time scans
      const realtimeOptions: SlackScanOptions = {
        ...scanOptions,
        timeRange: 'hour', // Only look at the last hour for real-time monitoring
      };
      
      const results = await scanSlackMessages(realtimeOptions);
      
      // Only process if we're still monitoring (could have been turned off while waiting)
      if (isRealTimeMonitoring) {
        // Check for new violations
        setRealTimeViolations(prev => {
          const currentViolationIds = new Set(prev.map(v => v.messageId));
          const newViolations = results.violations.filter(v => !currentViolationIds.has(v.messageId));
          
          if (newViolations.length > 0) {
            // Notify about new violations
            newViolations.forEach(violation => {
              toast.warning(`New violation detected: ${violation.rule}`, {
                description: violation.context,
                duration: 5000,
              });
            });
            
            return [...newViolations, ...prev];
          }
          
          return prev;
        });
        
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Real-time scan error:', error);
      // Don't show errors to the user for background scans
    }
  };

  const toggleRealTimeMonitoring = () => {
    if (isRealTimeMonitoring) {
      // Stop real-time monitoring
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
        monitoringIntervalRef.current = null;
      }
      setIsRealTimeMonitoring(false);
      toast.info('Real-time monitoring stopped');
    } else {
      // Start real-time monitoring
      if (!isSlackConnected()) {
        toast.error('Please connect to Slack first');
        return;
      }

      toast.success('Real-time monitoring started');
      setIsRealTimeMonitoring(true);
      setLastUpdated(new Date());
      
      // Initial scan
      performRealTimeScan();
      
      // Set up interval for real-time scans
      monitoringIntervalRef.current = window.setInterval(performRealTimeScan, 30000); // Check every 30 seconds
    }
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, []);

  return (
    <Button 
      onClick={toggleRealTimeMonitoring}
      variant={isRealTimeMonitoring ? "destructive" : "outline"}
      disabled={!isSlackConnected() || isScanning}
      className="flex items-center gap-2"
    >
      {isRealTimeMonitoring ? (
        <>
          <ZapOff className="h-4 w-4" />
          Stop Real-time Monitoring
        </>
      ) : (
        <>
          <Zap className="h-4 w-4" />
          Start Real-time Monitoring
        </>
      )}
    </Button>
  );
};

export default SlackRealTimeController;
