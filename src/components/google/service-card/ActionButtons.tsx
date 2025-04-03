
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Scan, FileText } from 'lucide-react';
import { ActionButtonsProps } from './types';

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isConnected,
  isConnecting,
  isUploading = false,
  isScanned = false,
  fileUploaded,
  handleConnect,
  handleUpload,
  handleDownload,
  actionButtonText,
  connectVariant = 'default',
  uploadVariant = 'outline',
  downloadVariant = 'default',
  isCompactView = false,
}) => {
  const buttonSize = isCompactView ? "sm" : "default";
  
  return (
    <div className="flex flex-col space-y-2">
      <Button 
        variant={isConnected ? "outline" : connectVariant} 
        className="w-full"
        onClick={handleConnect}
        disabled={isConnecting}
        size={buttonSize}
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {isCompactView ? "Connecting..." : "Connecting..."}
          </>
        ) : isConnected ? (
          'Disconnect'
        ) : (
          'Connect'
        )}
      </Button>
      
      {isConnected && (
        <>
          {fileUploaded ? (
            <div className={`flex items-center border border-gray-200 rounded-md ${isCompactView ? 'p-1' : 'p-2'} ${isCompactView ? 'text-xs' : 'text-sm'} bg-gray-50 mb-2`}>
              <FileText className={`${isCompactView ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} text-blue-500`} />
              <span className="truncate">{fileUploaded}</span>
            </div>
          ) : null}
          
          {!isScanned && handleUpload && (
            <Button 
              variant={uploadVariant} 
              className="w-full flex items-center" 
              onClick={handleUpload}
              disabled={isUploading}
              size={buttonSize}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isCompactView ? "Processing..." : "Processing..."}
                </>
              ) : (
                <>
                  {actionButtonText.includes('scan') ? (
                    <Scan className="h-4 w-4 mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {isCompactView && actionButtonText.length > 10 
                    ? (actionButtonText.includes('scan') ? 'Scan' : 'Upload')
                    : actionButtonText
                  }
                </>
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ActionButtons;
