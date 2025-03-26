
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Download, FileText } from 'lucide-react';
import { ButtonVariant, ActionButtonsProps } from './types';

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
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <Button 
        variant={isConnected ? "outline" : connectVariant} 
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
      
      {isConnected && (
        <>
          {fileUploaded ? (
            <div className="flex items-center border border-gray-200 rounded-md p-2 text-sm bg-gray-50 mb-2">
              <FileText className="h-4 w-4 mr-2 text-blue-500" />
              <span className="truncate">{fileUploaded}</span>
            </div>
          ) : null}
          
          {handleUpload && (!isScanned || !fileUploaded) && (
            <Button 
              variant={uploadVariant} 
              className="w-full flex items-center" 
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {actionButtonText}
                </>
              )}
            </Button>
          )}
          
          {isScanned && handleDownload && (
            <Button 
              variant={downloadVariant} 
              className="w-full flex items-center" 
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Document
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ActionButtons;
