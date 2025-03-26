
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
  onConnectDrive: () => void;
  onConnectGmail: () => void;
  onConnectDocs: () => void;
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
  onConnectDrive,
  onConnectGmail,
  onConnectDocs,
  onDisconnect,
  onScan,
  anyServiceConnected,
  disableScan
}) => {
  // Using only 'google' as the tab value since Microsoft services were removed
  const [activeTab] = useState<'google'>('google');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloud Services Integration</CardTitle>
        <CardDescription>
          Connect your cloud services to scan for compliance issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value="google" defaultValue="google">
          <TabsList className="mb-4">
            <TabsTrigger value="google">Google Services</TabsTrigger>
          </TabsList>
          
          <ServiceTabs 
            activeTab={activeTab}
            isScanning={isScanning}
            connectedServices={connectedServices}
            isConnectingDrive={isConnectingDrive}
            isConnectingGmail={isConnectingGmail}
            isConnectingDocs={isConnectingDocs}
            onConnectDrive={onConnectDrive}
            onConnectGmail={onConnectGmail}
            onConnectDocs={onConnectDocs}
            onDisconnect={onDisconnect}
          />
        </Tabs>
        
        <div className="flex justify-center mt-4">
          <ScanButton 
            onScan={onScan} 
            isScanning={isScanning} 
            disabled={!anyServiceConnected || disableScan}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CloudServicesCard;
