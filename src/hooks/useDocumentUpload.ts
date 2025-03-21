
import { useState } from 'react';
import { uploadFile, requestComplianceCheck, ComplianceReport } from '@/utils/apiService';
import { toast } from 'sonner';
import { Industry } from '@/utils/types';

export const useDocumentUpload = (onReportGenerated: (report: ComplianceReport) => void) => {
  const [file, setFile] = useState<File | null>(null);
  const [industry, setIndustry] = useState<Industry | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateProgress = () => {
    // Reset progress
    setProgress(0);
    
    // Simulate progress updates to give real-time feedback
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
    return interval;
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!industry) {
      toast.error('Please select an industry');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Start progress simulation for upload phase
      const uploadInterval = simulateProgress();
      
      const response = await uploadFile(file);
      
      // Clear the upload interval
      clearInterval(uploadInterval);
      setProgress(100);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      if (response.data?.id) {
        toast.success('Document uploaded successfully');
        setIsProcessing(true);
        setProgress(0);
        
        // Start a new progress simulation for processing phase
        const processingInterval = simulateProgress();
        
        const complianceResponse = await requestComplianceCheck(
          response.data.id,
          file.name,
          industry
        );
        
        // Clear the processing interval
        clearInterval(processingInterval);
        setProgress(100);
        
        if (complianceResponse.error) {
          toast.error(complianceResponse.error);
          return;
        }
        
        if (complianceResponse.data) {
          toast.success('Compliance analysis completed');
          onReportGenerated(complianceResponse.data);
        }
      }
    } catch (error) {
      console.error('Error in document processing:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return {
    file,
    setFile,
    industry,
    setIndustry,
    isDragging,
    setIsDragging,
    isUploading,
    isProcessing,
    progress,
    handleUpload
  };
};
