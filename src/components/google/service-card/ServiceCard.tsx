
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ServiceCardHeader from './ServiceCardHeader';
import ServiceCardActions from './ServiceCardActions';
import RealTimeMonitor from './RealTimeMonitor';
import AnalysisDialog from './AnalysisDialog';
import AuthDialog from './AuthDialog';
import { useMicrosoftServiceScanner } from '@/hooks/microsoft/useMicrosoftServiceScanner';
import { Industry, Region } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';

interface ServiceCardProps {
  serviceId: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isConnected: boolean;
  isConnecting: boolean;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  serviceId,
  icon,
  title,
  description,
  isConnected,
  isConnecting,
  isScanning,
  onConnect,
  onDisconnect
}) => {
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  
  // Determine if this is a Microsoft service
  const isMicrosoftService = 
    title === 'SharePoint' || 
    title === 'Outlook' || 
    title === 'Teams';
  
  // Get the service type for Microsoft services
  const getMicrosoftServiceType = () => {
    if (title === 'SharePoint') return 'sharepoint';
    if (title === 'Outlook') return 'outlook';
    if (title === 'Teams') return 'teams';
    return undefined;
  };
  
  const serviceType = getMicrosoftServiceType();
  
  // Use the Microsoft service scanner hook for Microsoft services
  const {
    handleScan: handleMicrosoftScan,
    showUploadDialog,
    setShowUploadDialog,
    UploadDialog,
    handleFileUpload,
  } = useMicrosoftServiceScanner({ 
    serviceId, 
    serviceType: serviceType as 'sharepoint' | 'outlook' | 'teams'
  });
  
  // Function to handle opening the appropriate dialog
  const handleScanClick = () => {
    if (isMicrosoftService) {
      setShowAnalysisDialog(true);
    }
  };
  
  // Function to handle scanning
  const handleScan = async (industry?: Industry, language?: SupportedLanguage, region?: Region) => {
    if (isMicrosoftService && serviceType) {
      await handleMicrosoftScan(industry, language, region);
    }
  };
  
  // Function to handle uploading a document
  const handleUploadDocument = () => {
    if (isMicrosoftService) {
      setShowUploadDialog(true);
    }
  };

  // Toggle real-time monitoring
  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };

  return (
    <Card className="overflow-hidden">
      <ServiceCardHeader 
        icon={icon} 
        title={title} 
        description={description}
        isConnected={isConnected}
        isRealTimeActive={isRealTimeActive}
        toggleRealTime={toggleRealTime}
      />
      
      <CardContent className="p-4 pt-0">
        {isConnected && (
          <RealTimeMonitor 
            serviceId={serviceId}
            serviceType={serviceType}
            isRealTimeActive={isRealTimeActive}
            lastUpdated={new Date()}
          />
        )}
        
        <ServiceCardActions 
          isConnected={isConnected}
          isConnecting={isConnecting}
          isScanning={isScanning}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          onScan={handleScanClick}
          onUploadDocument={isMicrosoftService ? handleUploadDocument : undefined}
        />
      </CardContent>
      
      {/* Analysis dialog for Microsoft services */}
      {isMicrosoftService && (
        <AnalysisDialog
          open={showAnalysisDialog}
          onOpenChange={setShowAnalysisDialog}
          onAnalyze={handleScan}
          serviceType={serviceType as 'sharepoint' | 'outlook' | 'teams'}
          title={`Scan ${title}`}
          description={description}
        />
      )}
      
      {/* Upload dialog for Microsoft services */}
      {isMicrosoftService && serviceType && (
        <UploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          onUpload={() => handleFileUpload()}
          industry={undefined}
          language={undefined}
          region={undefined}
        />
      )}
      
      {/* Auth dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        service={title}
      />
    </Card>
  );
};

export default ServiceCard;
