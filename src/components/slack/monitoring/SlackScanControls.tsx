
import React from 'react';
import SlackScanButton from './SlackScanButton';
import SlackRealTimeController from './SlackRealTimeController';
import { SlackScanOptions, SlackScanResults, SlackViolation } from '@/utils/slack/types';

interface SlackScanControlsProps {
  scanOptions: SlackScanOptions;
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
  setScanResults: (results: SlackScanResults | null) => void;
  setHasScanned: (value: boolean) => void;
  isRealTimeMonitoring: boolean;
  setIsRealTimeMonitoring: (value: boolean) => void;
  setRealTimeViolations: React.Dispatch<React.SetStateAction<SlackViolation[]>>;
  setLastUpdated: React.Dispatch<React.SetStateAction<Date | null>>;
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
  return (
    <div className="flex justify-between items-center mt-4 mb-6">
      <SlackRealTimeController 
        isRealTimeMonitoring={isRealTimeMonitoring}
        setIsRealTimeMonitoring={setIsRealTimeMonitoring}
        scanOptions={scanOptions}
        setRealTimeViolations={setRealTimeViolations}
        setLastUpdated={setLastUpdated}
        isScanning={isScanning}
      />
      
      <SlackScanButton 
        isScanning={isScanning}
        setIsScanning={setIsScanning}
        scanOptions={scanOptions}
        setScanResults={setScanResults}
        setHasScanned={setHasScanned}
        isRealTimeMonitoring={isRealTimeMonitoring}
      />
    </div>
  );
};

export default SlackScanControls;
