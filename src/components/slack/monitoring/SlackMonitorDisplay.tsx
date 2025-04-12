
import React from 'react';
import SlackViolationsList from '../SlackViolationsList';
import SlackRealTimeMonitor from '../SlackRealTimeMonitor';
import { SlackScanResults, SlackViolation } from '@/utils/slack/types';

interface SlackMonitorDisplayProps {
  isRealTimeMonitoring: boolean;
  realTimeViolations: SlackViolation[];
  lastUpdated: Date | null;
  isScanning: boolean;
  hasScanned: boolean;
  scanResults: SlackScanResults | null;
}

const SlackMonitorDisplay: React.FC<SlackMonitorDisplayProps> = ({
  isRealTimeMonitoring,
  realTimeViolations,
  lastUpdated,
  isScanning,
  hasScanned,
  scanResults
}) => {
  return (
    <>
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
    </>
  );
};

export default SlackMonitorDisplay;
