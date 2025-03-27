
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadDocument } from '@/utils/fileUploadService';
import { requestComplianceCheck } from '@/utils/complianceService';
import { ComplianceReport, Industry, Region } from '@/utils/types';

export const useDocumentUpload = (onReportGenerated: (report: ComplianceReport) => void) => {
  const [file, setFile] = useState<File | null>(null);
  const [industry, setIndustry] = useState<Industry | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (region?: Region) => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Simulate file upload with progress
      const uploadResult = await uploadDocument(file, (progress) => {
        setProgress(progress);
      });

      if (uploadResult.error) {
        toast.error(uploadResult.error);
        setIsUploading(false);
        return;
      }

      if (!uploadResult.data) {
        toast.error('Upload failed. Please try again.');
        setIsUploading(false);
        return;
      }

      // File uploaded, now process for compliance
      const { documentId, documentName } = uploadResult.data;
      
      setIsUploading(false);
      setIsProcessing(true);
      
      // Request compliance check
      const complianceResult = await requestComplianceCheck(documentId, documentName, industry, undefined, region);
      
      setIsProcessing(false);
      
      if (complianceResult.error) {
        toast.error(complianceResult.error);
        return;
      }
      
      if (complianceResult.data) {
        toast.success('Document analyzed successfully');
        // Let the parent component handle adding to history
        onReportGenerated(complianceResult.data);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during upload');
      setIsUploading(false);
      setIsProcessing(false);
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
