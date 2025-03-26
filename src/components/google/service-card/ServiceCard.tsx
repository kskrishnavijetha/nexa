
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceCardProps } from './types';
import ServiceCardHeader from './ServiceCardHeader';
import RealTimeMonitor from './RealTimeMonitor';
import ActionButtons from './ActionButtons';
import AuthDialog from './AuthDialog';
import UploadDialog from './UploadDialog';
import { getServiceHelperTexts } from './ServiceTextUtils';
import { useServiceCardState } from './hooks/useServiceCardState';

const ServiceCard: React.FC<ServiceCardProps> = ({
  serviceId,
  icon,
  title,
  description,
  isConnected,
  isConnecting,
  isScanning,
  onConnect,
  onDisconnect,
}) => {
  const {
    lastUpdated,
    isRealTimeActive,
    showAuthDialog,
    showUploadDialog,
    isUploading,
    hasScannedContent,
    uploadedFile,
    toggleRealTime,
    handleConnect,
    handleAuth,
    handleUpload,
    handleUploadSubmit,
    handleDownload,
    setShowAuthDialog,
    setShowUploadDialog
  } = useServiceCardState({
    serviceId,
    isConnected,
    isScanning,
    onConnect,
    onDisconnect
  });
  
  const helperTexts = getServiceHelperTexts(serviceId);

  return (
    <Card className="border-gray-200">
      <ServiceCardHeader 
        icon={icon}
        title={title}
        isConnected={isConnected}
        isRealTimeActive={isRealTimeActive}
        toggleRealTime={toggleRealTime}
      />

      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        
        <RealTimeMonitor 
          isActive={isConnected && isRealTimeActive}
          lastUpdated={lastUpdated}
        />
        
        <ActionButtons 
          isConnected={isConnected}
          isConnecting={isConnecting}
          isUploading={isUploading}
          isScanned={hasScannedContent}
          fileUploaded={uploadedFile?.name}
          handleConnect={handleConnect}
          handleUpload={handleUpload}
          handleDownload={handleDownload}
          actionButtonText={helperTexts.actionButtonText}
          connectVariant="default"
          uploadVariant="outline"
          downloadVariant="secondary"
        />

        <AuthDialog 
          isOpen={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
          onSubmit={handleAuth}
          title={title}
        />

        <UploadDialog 
          isOpen={showUploadDialog}
          onClose={() => setShowUploadDialog(false)}
          onSubmit={handleUploadSubmit}
          serviceId={serviceId}
          dialogTitle={helperTexts.uploadDialogTitle}
          dialogDescription={helperTexts.uploadDialogDescription}
          submitButtonText={helperTexts.submitButtonText}
        />
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
