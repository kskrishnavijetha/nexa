
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceCardProps } from './types';
import ServiceCardHeader from './ServiceCardHeader';
import RealTimeMonitor from './RealTimeMonitor';
import ActionButtons from './ActionButtons';
import { AuthDialog, UploadDialog, GoogleDocsDialog } from './dialogs';
import { getServiceHelperTexts } from './ServiceTextUtils';
import { useServiceCardState } from './hooks';

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
    showGoogleDocsDialog,
    isUploading,
    hasScannedContent,
    uploadedFile,
    toggleRealTime,
    handleConnect,
    handleAuth,
    handleUpload,
    handleUploadSubmit,
    handleGoogleDocsSubmit,
    handleDownload,
    setShowAuthDialog,
    setShowUploadDialog,
    setShowGoogleDocsDialog
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

        <GoogleDocsDialog
          isOpen={showGoogleDocsDialog}
          onClose={() => setShowGoogleDocsDialog(false)}
          onSubmit={handleGoogleDocsSubmit}
          dialogTitle="Upload Google Document"
          dialogDescription="Select a Google Docs file to upload for compliance scanning"
          submitButtonText="Upload & Scan"
        />
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
