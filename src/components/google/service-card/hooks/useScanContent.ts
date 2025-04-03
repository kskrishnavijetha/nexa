
import { useEffect, useState } from 'react';
import { UploadedFileInfo } from './types';

export const useScanContent = (
  isConnected: boolean, 
  isScanning: boolean, 
  isRealTimeActive: boolean, 
  uploadedFile: UploadedFileInfo | null
) => {
  const [hasScannedContent, setHasScannedContent] = useState(false);

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

  return {
    hasScannedContent,
    setHasScannedContent
  };
};
