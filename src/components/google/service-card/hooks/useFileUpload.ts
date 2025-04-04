
import { useState } from 'react';
import { toast } from 'sonner';
import { UploadedFileInfo } from './types';

export const useFileUpload = (serviceId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);

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
        
        // Auto-trigger scan after upload (this will be handled by the parent component)
        if (window && typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(new CustomEvent('file-uploaded', { 
            detail: { 
              serviceId, 
              fileName: formData.file.name 
            } 
          }));
        }
      } else if (serviceId.includes('gmail')) {
        console.log(`Scanning email content: ${formData.emailContent.substring(0, 20)}...`);
        setUploadedFile({
          name: `Email content (${new Date().toLocaleTimeString()})`,
          type: 'email',
          size: formData.emailContent.length
        });
        toast.success(`Email content scanned successfully`);
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
    }, 2000); // Simulate a 2-second upload process
  };

  const handleGoogleDocsSubmit = (formData: any) => {
    handleUploadSubmit(formData);
  };

  return {
    isUploading,
    uploadedFile,
    handleUploadSubmit,
    handleGoogleDocsSubmit,
    setUploadedFile
  };
};
