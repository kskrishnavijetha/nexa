
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, AlertCircle } from 'lucide-react';
import ServiceCard from './service-card/ServiceCard';
import { Drive, Gmail, FileText } from 'lucide-react';
import { GoogleService } from './types';
import ScanButton from './ScanButton';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const handleScan = () => {
    console.log('Scan handler triggered in CloudServicesCard');
    if (anyServiceConnected && !disableScan) {
      onScan();
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cloud className="h-5 w-5 mr-2" />
          Cloud Services Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!anyServiceConnected && (
          <Alert variant="default" className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect at least one service to begin scanning for compliance issues.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <ServiceCard
            serviceId="drive"
            icon={Drive}
            title="Google Drive"
            description="Scan files and documents in Google Drive for compliance with regulations."
            isConnected={connectedServices.includes('drive')}
            isConnecting={isConnectingDrive}
            isScanning={isScanning}
            onConnect={onConnectDrive}
            onDisconnect={() => onDisconnect('drive')}
          />
          
          <ServiceCard
            serviceId="gmail"
            icon={Gmail}
            title="Gmail"
            description="Analyze email content for potential compliance issues and data protection."
            isConnected={connectedServices.includes('gmail')}
            isConnecting={isConnectingGmail}
            isScanning={isScanning}
            onConnect={onConnectGmail}
            onDisconnect={() => onDisconnect('gmail')}
          />
          
          <ServiceCard
            serviceId="docs"
            icon={FileText}
            title="Google Docs"
            description="Scan Google Docs for sensitive data and compliance violations."
            isConnected={connectedServices.includes('docs')}
            isConnecting={isConnectingDocs}
            isScanning={isScanning}
            onConnect={onConnectDocs}
            onDisconnect={() => onDisconnect('docs')}
          />
        </div>
        
        <ScanButton 
          onScan={handleScan} 
          isScanning={isScanning} 
          disabled={!anyServiceConnected || disableScan}
        />
      </CardContent>
    </Card>
  );
};

export default CloudServicesCard;
