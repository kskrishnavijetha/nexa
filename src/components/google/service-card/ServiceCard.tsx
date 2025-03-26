
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceCardProps, UploadedFileInfo } from './types';
import ServiceCardHeader from './ServiceCardHeader';
import RealTimeMonitor from './RealTimeMonitor';
import ActionButtons from './ActionButtons';
import AuthDialog from './AuthDialog';
import UploadDialog from './UploadDialog';
import { getServiceHelperTexts } from './ServiceTextUtils';
import { toast } from 'sonner';

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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState<boolean>(false);
  const [realtimeTimer, setRealtimeTimer] = useState<number | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasScannedContent, setHasScannedContent] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);
  
  const helperTexts = getServiceHelperTexts(serviceId);
  
  // Real-time updates simulation
  useEffect(() => {
    if (isConnected && isRealTimeActive) {
      // Set up interval for real-time updates
      const interval = window.setInterval(() => {
        setLastUpdated(new Date());
      }, 10000); // Update every 10 seconds
      
      setRealtimeTimer(interval);
      
      return () => {
        if (realtimeTimer !== null) {
          window.clearInterval(realtimeTimer);
        }
      };
    } else if (!isRealTimeActive && realtimeTimer !== null) {
      window.clearInterval(realtimeTimer);
      setRealtimeTimer(null);
    }
  }, [isConnected, isRealTimeActive, realtimeTimer]);

  // Auto-activate real-time mode when connected
  useEffect(() => {
    if (isConnected) {
      setIsRealTimeActive(true);
    } else {
      setIsRealTimeActive(false);
      setHasScannedContent(false);
      setUploadedFile(null);
    }
  }, [isConnected]);

  // Set has scanned content when scanning is complete
  useEffect(() => {
    if (isConnected && !isScanning && isRealTimeActive && uploadedFile) {
      // Simulate having scanned content after a successful scan
      const timer = setTimeout(() => {
        setHasScannedContent(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, isScanning, isRealTimeActive, uploadedFile]);

  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };

  const handleConnect = () => {
    if (!isConnected) {
      setShowAuthDialog(true);
    } else {
      onDisconnect();
      setHasScannedContent(false);
      setUploadedFile(null);
    }
  };

  const handleAuth = (email: string, password: string) => {
    setShowAuthDialog(false);
    // Simulate authentication
    onConnect();
  };

  const handleUpload = () => {
    setShowUploadDialog(true);
  };

  const handleUploadSubmit = (formData: any) => {
    setIsUploading(true);
    
    // Simulate file upload based on service type
    setTimeout(() => {
      if (serviceId.includes('drive') && formData.file) {
        console.log(`Uploading file to Google Drive: ${formData.file.name}`);
        setUploadedFile({
          name: formData.file.name,
          type: formData.file.type,
          size: formData.file.size
        });
        toast.success(`File "${formData.file.name}" uploaded to Google Drive`);
      } else if (serviceId.includes('gmail')) {
        console.log(`Sending email to ${formData.recipientEmail} with subject: ${formData.emailSubject}`);
        setUploadedFile({
          name: `Email to ${formData.recipientEmail}`,
          type: 'email',
          size: formData.emailContent.length
        });
        toast.success(`Email content processed for ${formData.recipientEmail}`);
      } else if (serviceId.includes('docs')) {
        const docName = formData.docTitle || formData.file?.name || 'Untitled Document';
        console.log(`Uploading Google Doc: ${docName}`);
        setUploadedFile({
          name: docName,
          type: formData.file ? formData.file.type : 'application/vnd.google-apps.document',
          size: formData.file ? formData.file.size : formData.docContent?.length || 0
        });
        toast.success(`Document "${docName}" uploaded to Google Docs`);
      }
      
      setIsUploading(false);
      setShowUploadDialog(false);
    }, 2000); // Simulate a 2-second upload process
  };

  const handleDownload = () => {
    // Simulate downloading a document
    toast.info("Preparing document for download...");
    
    setTimeout(() => {
      let documentName = '';
      if (serviceId.includes('drive')) {
        documentName = uploadedFile?.name || 'drive-document.pdf';
      } else if (serviceId.includes('gmail')) {
        documentName = 'email-report.pdf';
      } else if (serviceId.includes('docs')) {
        documentName = uploadedFile?.name || 'google-doc.pdf';
      } else {
        documentName = 'document.pdf';
      }
      
      // Create a mock blob to simulate a file download
      const blob = new Blob(['Mock file content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`Document "${documentName}" downloaded successfully`);
    }, 1500);
  };

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
