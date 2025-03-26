
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

interface ActionButtonsProps {
  isConnected: boolean;
  isConnecting: boolean;
  handleConnect: () => void;
  handleUpload?: () => void;
  actionButtonText: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isConnected,
  isConnecting,
  handleConnect,
  handleUpload,
  actionButtonText,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <Button 
        variant={isConnected ? "outline" : "default"} 
        className="w-full"
        onClick={handleConnect}
        disabled={isConnecting}
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
      
      {isConnected && handleUpload && (
        <Button 
          variant="outline" 
          className="w-full flex items-center" 
          onClick={handleUpload}
        >
          <Upload className="h-4 w-4 mr-2" />
          {actionButtonText}
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
