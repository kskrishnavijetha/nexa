
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceTabs from './ServiceTabs';
import ScanButton from './ScanButton';
import { GoogleService } from './types';

interface CloudServicesCardProps {
  isScanning: boolean;
  connectedServices: GoogleService[];
  isConnectingDrive: boolean;
  isConnectingGmail: boolean;
  isConnectingDocs: boolean;
  isConnectingSharePoint: boolean;
  isConnectingOutlook: boolean;
  isConnectingTeams: boolean;
  onConnectDrive: () => void;
  onConnectGmail: () => void;
  onConnectDocs: () => void;
  onConnectSharePoint: () => void;
  onConnectOutlook: () => void;
  onConnectTeams: () => void;
  onDisconnect: (service: GoogleService) => void;
  onScan: () => void;
  anyServiceConnected: boolean;
  disableScan: boolean;
}

const CloudServicesCard: React.FC<CloudServicesCardProps> = ({
  isScanning,
  connectedServices,
  isConnectingDrive,
  isConnectingGmail,
  isConnectingDocs,
  isConnectingSharePoint,
  isConnectingOutlook,
  isConnectingTeams,
  onConnectDrive,
  onConnectGmail,
  onConnectDocs,
  onConnectSharePoint,
  onConnectOutlook,
  onConnectTeams,
  onDisconnect,
  onScan,
  anyServiceConnected,
  disableScan
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'microsoft'>('google');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloud Services Integration</CardTitle>
        <CardDescription>
          Connect your cloud services to scan for compliance issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'google' | 'microsoft')}>
          <TabsList className="mb-4">
            <TabsTrigger value="google">Google Services</TabsTrigger>
            <TabsTrigger value="microsoft">Microsoft Services</TabsTrigger>
          </TabsList>
          
          <ServiceTabs 
            activeTab={activeTab}
            isScanning={isScanning}
            connectedServices={connectedServices}
            isConnectingDrive={isConnectingDrive}
            isConnectingGmail={isConnectingGmail}
            isConnectingDocs={isConnectingDocs}
            isConnectingSharePoint={isConnectingSharePoint}
            isConnectingOutlook={isConnectingOutlook}
            isConnectingTeams={isConnectingTeams}
            onConnectDrive={onConnectDrive}
            onConnectGmail={onConnectGmail}
            onConnectDocs={onConnectDocs}
            onConnectSharePoint={onConnectSharePoint}
            onConnectOutlook={onConnectOutlook}
            onConnectTeams={onConnectTeams}
            onDisconnect={onDisconnect}
          />
        </Tabs>
        
        <ScanButton 
          onScan={onScan} 
          isScanning={isScanning} 
          disabled={!anyServiceConnected || disableScan}
        />
      </CardContent>
    </Card>
  );
};

export default CloudServicesCard;
