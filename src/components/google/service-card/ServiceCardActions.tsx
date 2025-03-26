
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Shield } from 'lucide-react';
import { ServiceCardActionsProps } from './types';

const ServiceCardActions: React.FC<ServiceCardActionsProps> = ({
  isConnected,
  isConnecting,
  isScanning,
  onConnect,
  onShowAnalysisDialog
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <Button 
        variant={isConnected ? "outline" : "default"} 
        className="w-full"
        onClick={onConnect}
        disabled={isConnecting || isScanning}
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : isConnected ? (
          'Disconnect'
        ) : (
          'Connect'
        )}
      </Button>
      
      {isConnected && (
        <Button 
          variant="outline" 
          className="w-full flex items-center" 
          onClick={onShowAnalysisDialog}
        >
          <Shield className="h-4 w-4 mr-2" />
          Analyze Compliance
        </Button>
      )}
    </div>
  );
};

export default ServiceCardActions;
