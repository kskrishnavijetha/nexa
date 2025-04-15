
import React, { useState } from 'react';
import SlackConnect from './SlackConnect';
import SlackScanOptions from './SlackScanOptions';
import { SlackScanOptions as SlackScanOptionsType, SlackScanResults, SlackViolation } from '@/utils/slack/types';
import { Separator } from '@/components/ui/separator';
import SlackMonitorHeader from './monitoring/SlackMonitorHeader';
import SlackScanControls from './monitoring/SlackScanControls';
import SlackMonitorDisplay from './monitoring/SlackMonitorDisplay';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { useAuth } from '@/contexts/AuthContext';
import { addSlackScanToHistory } from '@/utils/slack/slackReportGenerator';

const SlackMonitor: React.FC = () => {
  const [scanOptions, setScanOptions] = useState<SlackScanOptionsType>({
    channels: [],
    timeRange: 'day',
    language: 'en',
    sensitivityLevel: 'standard',
    includeAttachments: true,
    generateAuditTrail: true
  });
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<SlackScanResults | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [isRealTimeMonitoring, setIsRealTimeMonitoring] = useState(false);
  const [realTimeViolations, setRealTimeViolations] = useState<SlackViolation[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<string>('violations');
  
  // Get access to history store
  const addScanHistory = useServiceHistoryStore(state => state.addScanHistory);
  const { user } = useAuth();

  // Add completed scan to history
  const addToHistory = (results: SlackScanResults) => {
    if (!results) return;
    
    // Use the utility function to add to history
    addSlackScanToHistory(results);
  };
  
  return (
    <div className="space-y-6">
      <SlackMonitorHeader />
      
      <SlackConnect />
      
      <Separator className="my-6" />
      
      <SlackScanOptions 
        options={scanOptions} 
        onOptionsChange={setScanOptions} 
        disabled={isScanning || isRealTimeMonitoring}
      />
      
      <SlackScanControls 
        scanOptions={scanOptions}
        isScanning={isScanning}
        setIsScanning={setIsScanning}
        setScanResults={(results) => {
          setScanResults(results);
          if (results && results.status === 'completed') {
            addToHistory(results);
          }
        }}
        setHasScanned={setHasScanned}
        isRealTimeMonitoring={isRealTimeMonitoring}
        setIsRealTimeMonitoring={setIsRealTimeMonitoring}
        setRealTimeViolations={setRealTimeViolations}
        setLastUpdated={setLastUpdated}
      />
      
      <SlackMonitorDisplay 
        isRealTimeMonitoring={isRealTimeMonitoring}
        realTimeViolations={realTimeViolations}
        lastUpdated={lastUpdated}
        isScanning={isScanning}
        hasScanned={hasScanned}
        scanResults={scanResults}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default SlackMonitor;
