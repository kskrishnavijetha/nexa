
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceCardProps } from './types';
import ServiceCardHeader from './ServiceCardHeader';
import RealTimeMonitor from './RealTimeMonitor';
import ActionButtons from './ActionButtons';
import AuthDialog from './AuthDialog';
import UploadDialog from './UploadDialog';
import { getServiceHelperTexts } from './ServiceTextUtils';

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
    }
  }, [isConnected]);

  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };

  const handleConnect = () => {
    if (!isConnected) {
      setShowAuthDialog(true);
    } else {
      onDisconnect();
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
      } else if (serviceId.includes('gmail')) {
        console.log(`Sending email to ${formData.recipientEmail} with subject: ${formData.emailSubject}`);
      } else if (serviceId.includes('docs')) {
        console.log(`Creating Google Doc: ${formData.docTitle}`);
      }
      
      setIsUploading(false);
      setShowUploadDialog(false);
    }, 2000); // Simulate a 2-second upload process
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
          handleConnect={handleConnect}
          handleUpload={handleUpload}
          actionButtonText={helperTexts.actionButtonText}
          connectVariant="default"
          uploadVariant="outline"
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
