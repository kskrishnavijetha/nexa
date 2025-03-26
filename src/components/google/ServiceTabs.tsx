
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { GoogleService } from './types';
import { Cloud, FileText, Mail, MessageSquare, ShareIcon } from 'lucide-react';
import ServiceCard from './service-card/ServiceCard';

interface ServicesTabProps {
  activeTab: 'google' | 'microsoft';
  isScanning: boolean;
  connectedServices: GoogleService[];
  // Connection states
  isConnectingDrive: boolean;
  isConnectingGmail: boolean;
  isConnectingDocs: boolean;
  isConnectingSharePoint: boolean;
  isConnectingOutlook: boolean;
  isConnectingTeams: boolean;
  // Event handlers
  onConnectDrive: () => void;
  onConnectGmail: () => void;
  onConnectDocs: () => void;
  onConnectSharePoint: () => void;
  onConnectOutlook: () => void;
  onConnectTeams: () => void;
  onDisconnect: (service: GoogleService) => void;
}

const ServiceTabs: React.FC<ServicesTabProps> = ({
  activeTab,
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
}) => {
  const isDriveConnected = connectedServices.includes('drive');
  const isGmailConnected = connectedServices.includes('gmail');
  const isDocsConnected = connectedServices.includes('docs');
  const isSharePointConnected = connectedServices.includes('sharepoint');
  const isOutlookConnected = connectedServices.includes('outlook');
  const isTeamsConnected = connectedServices.includes('teams');

  return (
    <>
      <TabsContent value="google">
        <div className="grid gap-4 md:grid-cols-3">
          <ServiceCard
            serviceId="drive-1"
            icon={<Cloud className="h-4 w-4 mr-2 text-blue-500" />}
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
            icon={<Mail className="h-4 w-4 mr-2 text-red-500" />}
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
            icon={<FileText className="h-4 w-4 mr-2 text-green-500" />}
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
      
      <TabsContent value="microsoft">
        <div className="grid gap-4 md:grid-cols-3">
          <ServiceCard
            serviceId="sharepoint-1"
            icon={<ShareIcon className="h-4 w-4 mr-2 text-blue-600" />}
            title="SharePoint"
            description="Scan SharePoint sites and documents for compliance issues"
            isConnected={isSharePointConnected}
            isConnecting={isConnectingSharePoint}
            isScanning={isScanning}
            onConnect={onConnectSharePoint}
            onDisconnect={() => onDisconnect('sharepoint')}
          />
          
          <ServiceCard
            serviceId="outlook-1"
            icon={<Mail className="h-4 w-4 mr-2 text-blue-700" />}
            title="Outlook"
            description="Analyze Outlook emails for sensitive information and compliance violations"
            isConnected={isOutlookConnected}
            isConnecting={isConnectingOutlook}
            isScanning={isScanning}
            onConnect={onConnectOutlook}
            onDisconnect={() => onDisconnect('outlook')}
          />
          
          <ServiceCard
            serviceId="teams-1"
            icon={<MessageSquare className="h-4 w-4 mr-2 text-purple-600" />}
            title="Teams"
            description="Scan Teams messages and channels for PII and regulatory compliance"
            isConnected={isTeamsConnected}
            isConnecting={isConnectingTeams}
            isScanning={isScanning}
            onConnect={onConnectTeams}
            onDisconnect={() => onDisconnect('teams')}
          />
        </div>
      </TabsContent>
    </>
  );
};

export default ServiceTabs;
