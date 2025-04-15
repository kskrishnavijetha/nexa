
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { SlackScanResults, SlackViolation } from '@/utils/slack/types';
import SlackViolationsTable from '../SlackViolationsTable';
import SlackRealTimeMonitor from '../SlackRealTimeMonitor';
import SlackAuditTrail from '../SlackAuditTrail';
import SlackScanSummary from '../SlackScanSummary';

interface SlackMonitorDisplayProps {
  isRealTimeMonitoring: boolean;
  realTimeViolations: SlackViolation[];
  lastUpdated: Date | null;
  isScanning: boolean;
  hasScanned: boolean;
  scanResults: SlackScanResults | null;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const SlackMonitorDisplay: React.FC<SlackMonitorDisplayProps> = ({
  isRealTimeMonitoring,
  realTimeViolations,
  lastUpdated,
  isScanning,
  hasScanned,
  scanResults,
  activeTab,
  onTabChange
}) => {
  if (isRealTimeMonitoring) {
    return (
      <SlackRealTimeMonitor 
        violations={realTimeViolations} 
        lastUpdated={lastUpdated} 
      />
    );
  }

  if (!hasScanned && !isScanning) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500 py-8">
            Run a scan to view results or start real-time monitoring.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isScanning) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500 py-8">
            Scanning Slack messages...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="mb-4 grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>
          
          <TabsContent value="violations">
            {scanResults && (
              <SlackViolationsTable violations={scanResults.violations} />
            )}
          </TabsContent>
          
          <TabsContent value="summary">
            {scanResults && (
              <SlackScanSummary results={scanResults} />
            )}
          </TabsContent>
          
          <TabsContent value="audit">
            {scanResults && (
              <SlackAuditTrail scanResults={scanResults} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SlackMonitorDisplay;
