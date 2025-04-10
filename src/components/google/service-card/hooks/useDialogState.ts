
import { useState } from 'react';
import { useGoogleAuth } from '@/hooks/google/useGoogleAuth';

export const useDialogState = (
  serviceId: string,
  onConnect: () => void, 
  onDisconnect: () => void, 
  isConnected: boolean
) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showGoogleDocsDialog, setShowGoogleDocsDialog] = useState(false);
  const { isGoogleAuthenticated } = useGoogleAuth();

  const handleConnect = () => {
    if (!isConnected) {
      // For Google Drive, we'll bypass the dialog and use direct OAuth
      if (serviceId.includes('drive')) {
        onConnect();
      } else {
        setShowAuthDialog(true);
      }
    } else {
      onDisconnect();
    }
  };

  const handleAuth = () => {
    setShowAuthDialog(false);
    // Simulate authentication
    onConnect();
  };

  const handleUpload = () => {
    if (serviceId.includes('docs')) {
      setShowGoogleDocsDialog(true);
    } else {
      setShowUploadDialog(true);
    }
  };

  return {
    showAuthDialog,
    showUploadDialog,
    showGoogleDocsDialog,
    setShowAuthDialog,
    setShowUploadDialog,
    setShowGoogleDocsDialog,
    handleConnect,
    handleAuth,
    handleUpload
  };
};
