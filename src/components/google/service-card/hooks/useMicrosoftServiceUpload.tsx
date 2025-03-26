
import { useState } from 'react';
import { toast } from 'sonner';
import { scanMicrosoftService } from '@/utils/microsoft/microsoftServices';
import { Industry, Region } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';

export const useMicrosoftServiceUpload = (
  serviceId: string,
  isConnected: boolean,
  serviceName: string
) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const handleFileUpload = async (
    files: File[], 
    industry?: Industry,
    language?: SupportedLanguage,
    region?: Region
  ) => {
    if (!isConnected) {
      toast.error(`Please connect to ${serviceName} first`);
      return false;
    }
    
    if (!files || files.length === 0) {
      toast.error("No files selected");
      return false;
    }
    
    if (!industry) {
      toast.error("Please select an industry before scanning");
      return false;
    }
    
    setIsUploading(true);
    
    try {
      toast.info(`Uploading and scanning ${files.length} files from ${serviceName}...`);
      
      // Add files to the state
      setUploadedFiles(prev => [...prev, ...files]);
      
      // Simulate scanning the uploaded files
      const result = await scanMicrosoftService(serviceId, industry, language, region);
      
      if (result.error) {
        toast.error(result.error);
        return false;
      }
      
      toast.success(`Successfully scanned ${files.length} files from ${serviceName}`);
      return true;
    } catch (error) {
      console.error(`Error uploading files to ${serviceName}:`, error);
      toast.error(`Failed to upload files to ${serviceName}`);
      return false;
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearUploadedFiles = () => {
    setUploadedFiles([]);
  };
  
  return {
    isUploading,
    uploadedFiles,
    handleFileUpload,
    clearUploadedFiles
  };
};
