
import React, { useState, useRef, DragEvent } from 'react';
import { uploadFile, requestComplianceCheck, ComplianceReport, Industry, INDUSTRY_REGULATIONS } from '@/utils/apiService';
import { validateFile, formatFileSize } from '@/utils/fileUtils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileText, FileUp, File, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentUploaderProps {
  onReportGenerated: (report: ComplianceReport) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onReportGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [industry, setIndustry] = useState<Industry | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validation = validateFile(selectedFile);
      
      if (validation.valid) {
        setFile(selectedFile);
      } else if (validation.error) {
        toast.error(validation.error);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validation = validateFile(droppedFile);
      
      if (validation.valid) {
        setFile(droppedFile);
      } else if (validation.error) {
        toast.error(validation.error);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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

  const getFileIcon = () => {
    if (!file) return <FileUp className="w-12 h-12 text-muted-foreground" />;
    
    const type = file.type;
    if (type === 'application/pdf') {
      return <File className="w-12 h-12 text-red-500" />;
    } else if (type.includes('word')) {
      return <FileText className="w-12 h-12 text-blue-500" />;
    } else if (type === 'text/plain') {
      return <FileText className="w-12 h-12 text-gray-500" />;
    }
    
    return <File className="w-12 h-12 text-muted-foreground" />;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted'
        } flex flex-col items-center justify-center p-8`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          accept=".pdf,.docx,.doc,.txt"
        />
        
        <div className="flex flex-col items-center">
          {getFileIcon()}
          
          <h3 className="mt-4 font-semibold text-lg">
            {file ? file.name : 'Upload your document'}
          </h3>
          
          {file && (
            <p className="text-sm text-muted-foreground mt-1">
              {formatFileSize(file.size)}
            </p>
          )}
          
          {!file && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Drag & drop your file here, or click to browse
              <br />
              <span className="text-xs">
                Supports PDF, DOCX, and TXT (up to 10MB)
              </span>
            </p>
          )}
          
          <div className="w-full mt-4">
            <label className="text-sm font-medium mb-1 block">Select Industry</label>
            <Select value={industry} onValueChange={(value) => setIndustry(value as Industry)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(INDUSTRY_REGULATIONS).map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(isUploading || isProcessing) && (
            <div className="w-full mt-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center mt-2 text-muted-foreground">
                {isUploading ? 'Uploading document...' : 'Analyzing compliance...'}
                {' '}{Math.round(progress)}%
              </p>
            </div>
          )}
          
          <div className="mt-6 flex gap-3">
            {!file ? (
              <Button onClick={triggerFileInput} className="px-6">
                Select File
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={triggerFileInput} size="sm">
                  Change File
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading || isProcessing || !industry}
                  className="px-6"
                >
                  {isUploading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isProcessing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isUploading ? 'Uploading...' : 
                   isProcessing ? 'Analyzing...' : 'Analyze Document'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
