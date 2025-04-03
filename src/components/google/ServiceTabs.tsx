
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { GoogleService } from './types';
import { Cloud, FileText, Mail } from 'lucide-react';
import ServiceCard from './service-card/ServiceCard';

interface ServicesTabProps {
  activeTab: 'google';
  isScanning: boolean;
  connectedServices: GoogleService[];
  // Connection states
  isConnectingDrive: boolean;
  isConnectingGmail: boolean;
  isConnectingDocs: boolean;
  // Event handlers
  onConnectDrive: () => void;
  onConnectGmail: () => void;
  onConnectDocs: () => void;
  onDisconnect: (service: GoogleService) => void;
}

const ServiceTabs: React.FC<ServicesTabProps> = ({
  activeTab,
  isScanning,
  connectedServices,
  isConnectingDrive,
  isConnectingGmail,
  isConnectingDocs,
  onConnectDrive,
  onConnectGmail,
  onConnectDocs,
  onDisconnect,
}) => {
  const isDriveConnected = connectedServices.includes('drive');
  const isGmailConnected = connectedServices.includes('gmail');
  const isDocsConnected = connectedServices.includes('docs');

  return (
    <TabsContent value="google">
      <div className="grid gap-4 md:grid-cols-3">
        <ServiceCard
          serviceId="drive-1"
          icon={Cloud}
          title="Google Drive"
          description="Scan your Drive files for sensitive data and compliance issues"
          isConnected={isDriveConnected}
          isConnecting={isConnectingDrive}
          isScanning={isScanning}
          onConnect={onConnectDrive}
          onDisconnect={() => onDisconnect('drive')}
        />
        
        <ServiceCard
          serviceId="gmail-1"
          icon={Mail}
          title="Gmail"
          description="Analyze email content for potential compliance violations"
          isConnected={isGmailConnected}
          isConnecting={isConnectingGmail}
          isScanning={isScanning}
          onConnect={onConnectGmail}
          onDisconnect={() => onDisconnect('gmail')}
        />
        
        <ServiceCard
          serviceId="docs-1"
          icon={FileText}
          title="Google Docs"
          description="Check documents for regulatory compliance and PII"
          isConnected={isDocsConnected}
          isConnecting={isConnectingDocs}
          isScanning={isScanning}
          onConnect={onConnectDocs}
          onDisconnect={() => onDisconnect('docs')}
        />
      </div>
    </TabsContent>
  );
};

export default ServiceTabs;
