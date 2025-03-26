
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceCardProps } from './types';
import ServiceCardHeader from './ServiceCardHeader';
import RealTimeMonitor from './RealTimeMonitor';
import ActionButtons from './ActionButtons';
import { AuthDialog, UploadDialog, GoogleDocsDialog } from './dialogs';
import { getServiceHelperTexts } from './ServiceTextUtils';
import { useServiceCardState } from './hooks';
import { useMicrosoftServiceUpload } from './hooks/useMicrosoftServiceUpload';

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
    isUploading: isServiceUploading,
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
  
  // Check if this is a Microsoft service
  const isMicrosoftService = serviceId.includes('sharepoint') || 
                            serviceId.includes('outlook') || 
                            serviceId.includes('teams');
  
  // Use Microsoft specific upload hook if it's a Microsoft service
  const microsoftUpload = useMicrosoftServiceUpload(
    serviceId,
    isConnected,
    title
  );
  
  const isUploading = isServiceUploading || (isMicrosoftService && microsoftUpload.isUploading);
  
  const helperTexts = getServiceHelperTexts(serviceId);

  // Update action button text based on service type
  let actionButtonText = helperTexts.actionButtonText;
  if (isMicrosoftService) {
    actionButtonText = isConnected ? "Upload Files" : "Connect";
  }

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
          isScanned={hasScannedContent || (isMicrosoftService && microsoftUpload.uploadedFiles.length > 0)}
          fileUploaded={uploadedFile?.name || (isMicrosoftService && microsoftUpload.uploadedFiles.length > 0 ? 
            `${microsoftUpload.uploadedFiles.length} files` : undefined)}
          handleConnect={handleConnect}
          handleUpload={isMicrosoftService ? () => setShowUploadDialog(true) : handleUpload}
          handleDownload={handleDownload}
          actionButtonText={actionButtonText}
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
          onSubmit={isMicrosoftService ? 
            (files) => microsoftUpload.handleFileUpload(files) : 
            handleUploadSubmit}
          serviceId={serviceId}
          dialogTitle={helperTexts.uploadDialogTitle || `Upload ${title} Files`}
          dialogDescription={helperTexts.uploadDialogDescription || 
            `Select files to upload for compliance scanning in ${title}`}
          submitButtonText={helperTexts.submitButtonText || "Upload & Scan"}
          allowMultiple={isMicrosoftService}
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
