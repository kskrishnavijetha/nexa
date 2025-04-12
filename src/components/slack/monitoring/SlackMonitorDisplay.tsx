
import React from 'react';
import { SlackScanResults, SlackViolation } from '@/utils/slack/types';
import SlackViolationsList from '../SlackViolationsList';
import SlackAuditTrail from '../SlackAuditTrail';

interface SlackMonitorDisplayProps {
  isRealTimeMonitoring: boolean;
  realTimeViolations: SlackViolation[];
  lastUpdated: Date | null;
  isScanning: boolean;
  hasScanned: boolean;
  scanResults: SlackScanResults | null;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const SlackMonitorDisplay: React.FC<SlackMonitorDisplayProps> = ({
  isRealTimeMonitoring,
  realTimeViolations,
  lastUpdated,
  isScanning,
  hasScanned,
  scanResults,
  activeTab = 'violations',
  onTabChange
}) => {
  const tabs = [
    { id: 'violations', label: 'Violations' },
    { id: 'audit', label: 'Audit Trail' }
  ];

  return (
    <div className="mt-6">
      <div className="flex border-b mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 ${activeTab === tab.id 
              ? 'border-b-2 border-primary text-primary font-medium' 
              : 'text-muted-foreground'}`}
            onClick={() => onTabChange && onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'violations' && (
        <SlackViolationsList 
          violations={isRealTimeMonitoring ? realTimeViolations : scanResults?.violations || []}
          isLoading={isScanning}
        />
      )}

      {activeTab === 'audit' && (
        <SlackAuditTrail scanResults={scanResults} />
      )}
    </div>
  );
};

export default SlackMonitorDisplay;
