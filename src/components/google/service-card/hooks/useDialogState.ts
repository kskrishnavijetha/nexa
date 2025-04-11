
import { useState } from 'react';

export const useDialogState = (
  serviceId: string,
  onConnect: () => void, 
  onDisconnect: () => void, 
  isConnected: boolean
) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showGoogleDocsDialog, setShowGoogleDocsDialog] = useState(false);

  const handleConnect = () => {
    if (!isConnected) {
      setShowAuthDialog(true);
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
