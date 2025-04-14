
import { useState, useCallback } from 'react';
import { ComplianceReport, Industry, Region } from '@/utils/types';
import { toast } from 'sonner';
import { requestMultiFrameworkComplianceCheck } from '@/utils/multiFrameworkComplianceService';
import { requestComplianceCheck } from '@/utils/complianceService';

interface UseDocumentUploadProps {
  onReportGenerated: (report: ComplianceReport) => void;
}

interface UploadOptions {
  region?: Region;
  frameworks?: string[];
}

export function useDocumentUpload({ onReportGenerated }: UseDocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [industry, setIndustry] = useState<Industry | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = useCallback(async (options?: UploadOptions) => {
    if (!file || !industry) {
      toast.error('Please select a file and industry');
      return;
    }
    
    // Start upload simulation
    setIsUploading(true);
    setProgress(0);
    
    // Simulate file upload progress
    const uploadInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear upload interval and set as processing
      clearInterval(uploadInterval);
      setIsUploading(false);
      setIsProcessing(true);
      
      // Generate random document ID
      const documentId = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Check if we're using multi-framework compliance or standard
      let report: ComplianceReport;
      
      if (options?.frameworks && options.frameworks.length > 0) {
        // Use multi-framework compliance check
        report = await requestMultiFrameworkComplianceCheck(
          documentId,
          file.name,
          options.frameworks,
          industry,
          undefined,
          options.region
        );
      } else {
        // Use standard compliance check
        const response = await requestComplianceCheck(
          documentId,
          file.name,
          industry,
          undefined,
          options?.region
        );
        
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to analyze the document');
        }
        
        report = response.data;
      }
      
      // Add the original filename to the report
      report.originalFileName = file.name;
      
      // Call onReportGenerated callback
      onReportGenerated(report);
      
      // Show success toast
      toast.success('Document analyzed successfully', {
        description: `Overall compliance score: ${report.overallScore}%`,
      });
    } catch (error) {
      console.error('Document upload error:', error);
      toast.error('Failed to analyze document', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      clearInterval(uploadInterval);
      setIsUploading(false);
      setIsProcessing(false);
      setProgress(0);
    }
  }, [file, industry, onReportGenerated]);

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
}
