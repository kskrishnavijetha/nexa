
import { useEffect, useRef } from 'react';
import { ServiceCardStateProps, ServiceCardStateReturn } from './types';
import { useRealTimeMonitoring } from './useRealTimeMonitoring';
import { useDialogState } from './useDialogState';
import { useFileUpload } from './useFileUpload';
import { useScanContent } from './useScanContent';
import { useDownload } from './useDownload';

export const useServiceCardState = ({
  serviceId,
  isConnected,
  isScanning,
  onConnect,
  onDisconnect,
}: ServiceCardStateProps): ServiceCardStateReturn => {
  // Use the extracted hooks
  const { 
    lastUpdated, 
    isRealTimeActive, 
    realtimeTimer, 
    toggleRealTime 
  } = useRealTimeMonitoring(isConnected);
  
  const {
    showAuthDialog,
    showUploadDialog,
    showGoogleDocsDialog,
    setShowAuthDialog,
    setShowUploadDialog,
    setShowGoogleDocsDialog,
    handleConnect,
    handleAuth,
    handleUpload
  } = useDialogState(serviceId, onConnect, onDisconnect, isConnected);

  const {
    isUploading,
    uploadedFile,
    handleUploadSubmit,
    handleGoogleDocsSubmit,
    setUploadedFile
  } = useFileUpload(serviceId);

  const { 
    hasScannedContent, 
    setHasScannedContent 
  } = useScanContent(isConnected, isScanning, isRealTimeActive, uploadedFile);
  
  const { handleDownload } = useDownload(serviceId, uploadedFile);

  // Track cleanup status
  const hasCleanedUp = useRef(false);

  // Reset content when disconnected
  useEffect(() => {
    if (!isConnected && !hasCleanedUp.current) {
      setHasScannedContent(false);
      setUploadedFile(null);
      hasCleanedUp.current = true;
    } else if (isConnected) {
      hasCleanedUp.current = false;
    }
  }, [isConnected, setHasScannedContent, setUploadedFile]);

  return {
    lastUpdated,
    isRealTimeActive,
    realtimeTimer,
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
  };
};
