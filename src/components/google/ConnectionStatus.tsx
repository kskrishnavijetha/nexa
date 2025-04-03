
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GoogleService } from './types';
import { Cloud, Mail, FileText } from 'lucide-react';

interface ConnectionStatusProps {
  connectedServices: GoogleService[];
  isScanning: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connectedServices,
  isScanning
}) => {
  // If no services are connected, show an empty state
  if (connectedServices.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">
            No services connected. Connect at least one service to start scanning.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Helper function to get icon for a service
  const getServiceIcon = (service: GoogleService) => {
    switch (service) {
      case 'drive':
        return <Cloud className="h-4 w-4 text-blue-500" />;
      case 'gmail':
        return <Mail className="h-4 w-4 text-red-500" />;
      case 'docs':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <Cloud className="h-4 w-4" />;
    }
  };

  // Helper function to get display name for a service
  const getServiceName = (service: GoogleService) => {
    switch (service) {
      case 'drive':
        return 'Google Drive';
      case 'gmail':
        return 'Gmail';
      case 'docs':
        return 'Google Docs';
      default:
        return service;
    }
  };

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-2">Connected Services</h3>
        <div className="space-y-2">
          {connectedServices.map((service) => (
            <div key={service} className="flex items-center justify-between p-2 bg-background rounded-md">
              <div className="flex items-center">
                {getServiceIcon(service)}
                <span className="ml-2 text-sm">{getServiceName(service)}</span>
              </div>
              <Badge 
                variant={isScanning ? "secondary" : "default"}
                className={isScanning ? "animate-pulse" : ""}
              >
                {isScanning ? 'Scanning...' : 'Connected'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionStatus;
