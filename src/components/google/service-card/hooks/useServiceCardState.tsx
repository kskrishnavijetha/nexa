
import { useState, useEffect } from 'react';
import { UploadedFileInfo } from '../types';
import { toast } from 'sonner';

export interface ServiceCardStateProps {
  serviceId: string;
  isConnected: boolean;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const useServiceCardState = ({
  serviceId,
  isConnected,
  isScanning,
  onConnect,
  onDisconnect,
}: ServiceCardStateProps) => {
  // State
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState<boolean>(false);
  const [realtimeTimer, setRealtimeTimer] = useState<number | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showGoogleDocsDialog, setShowGoogleDocsDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasScannedContent, setHasScannedContent] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);

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
    if (serviceId.includes('docs')) {
      setShowGoogleDocsDialog(true);
    } else {
      setShowUploadDialog(true);
    }
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
          size: formData.file ? formData.file.size : 0
        });
        toast.success(`Document "${docName}" uploaded to Google Docs`);
      }
      
      setIsUploading(false);
      setShowUploadDialog(false);
      setShowGoogleDocsDialog(false);
    }, 2000); // Simulate a 2-second upload process
  };

  const handleGoogleDocsSubmit = (formData: any) => {
    handleUploadSubmit(formData);
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

  return {
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
  };
};
