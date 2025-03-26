
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Upload } from 'lucide-react';

interface ServiceCardActionsProps {
  isConnected: boolean;
  isConnecting: boolean;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onScan: () => void;
  onUploadDocument?: () => void;
}

const ServiceCardActions: React.FC<ServiceCardActionsProps> = ({
  isConnected,
  isConnecting,
  isScanning,
  onConnect,
  onDisconnect,
  onScan,
  onUploadDocument
}) => {
  return (
    <div className="space-y-2 mt-4">
      {!isConnected ? (
        <Button 
          onClick={onConnect} 
          className="w-full"
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect'
          )}
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Button 
              onClick={onScan} 
              className="flex-1"
              variant="secondary"
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Scan
                </>
              )}
            </Button>
            
            {onUploadDocument && (
              <Button 
                onClick={onUploadDocument} 
                className="flex-1"
                variant="secondary"
                disabled={isScanning}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            )}
          </div>
          
          <Button 
            onClick={onDisconnect} 
            variant="destructive"
            className="w-full"
            disabled={isScanning}
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceCardActions;
