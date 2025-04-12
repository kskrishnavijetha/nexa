
import React, { useState, useEffect, useRef } from 'react';
import SlackConnect from './SlackConnect';
import SlackScanOptions from './SlackScanOptions';
import SlackViolationsList from './SlackViolationsList';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Zap, ZapOff } from 'lucide-react';
import { SlackScanOptions as SlackScanOptionsType, SlackScanResults, SlackViolation } from '@/utils/slack/types';
import { isSlackConnected, scanSlackMessages } from '@/utils/slack/slackService';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import SlackRealTimeMonitor from './SlackRealTimeMonitor';

const SlackMonitor: React.FC = () => {
  const [scanOptions, setScanOptions] = useState<SlackScanOptionsType>({
    channels: [],
    timeRange: 'day',
    language: 'en',
    sensitivityLevel: 'standard'
  });
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<SlackScanResults | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [isRealTimeMonitoring, setIsRealTimeMonitoring] = useState(false);
  const [realTimeViolations, setRealTimeViolations] = useState<SlackViolation[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const monitoringIntervalRef = useRef<number | null>(null);
  
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
  
  const performRealTimeScan = async () => {
    try {
      // Use a more limited scope for real-time scans
      const realtimeOptions: SlackScanOptionsType = {
        ...scanOptions,
        timeRange: 'hour', // Only look at the last hour for real-time monitoring
      };
      
      const results = await scanSlackMessages(realtimeOptions);
      
      // Only process if we're still monitoring (could have been turned off while waiting)
      if (isRealTimeMonitoring) {
        // Check for new violations
        const currentViolationIds = new Set(realTimeViolations.map(v => v.messageId));
        const newViolations = results.violations.filter(v => !currentViolationIds.has(v.messageId));
        
        if (newViolations.length > 0) {
          setRealTimeViolations(prev => [...newViolations, ...prev]);
          
          // Notify about new violations
          newViolations.forEach(violation => {
            toast.warning(`New violation detected: ${violation.rule}`, {
              description: violation.context,
              duration: 5000,
            });
          });
        }
        
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Real-time scan error:', error);
      // Don't show errors to the user for background scans
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Slack Compliance Monitor</h2>
        <p className="text-muted-foreground mb-4">
          Monitor your Slack workspace for potential compliance violations in messages and file uploads.
        </p>
      </div>
      
      <SlackConnect />
      
      <Separator className="my-6" />
      
      <SlackScanOptions 
        options={scanOptions} 
        onOptionsChange={setScanOptions} 
        disabled={isScanning || isRealTimeMonitoring}
      />
      
      <div className="flex justify-between items-center mt-4 mb-6">
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
      </div>
      
      {/* Show real-time monitoring status and results if active */}
      {isRealTimeMonitoring && (
        <SlackRealTimeMonitor 
          violations={realTimeViolations}
          lastUpdated={lastUpdated}
        />
      )}
      
      {/* Show regular scan results if available */}
      {(isScanning || hasScanned) && !isRealTimeMonitoring && (
        <SlackViolationsList 
          violations={scanResults?.violations || []} 
          isLoading={isScanning}
        />
      )}
    </div>
  );
};

export default SlackMonitor;
