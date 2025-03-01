
import React, { useState, useRef, DragEvent } from 'react';
import { uploadFile, requestComplianceCheck } from '@/utils/apiService';
import { validateFile, formatFileSize } from '@/utils/fileUtils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileText, FileUp, File, Loader2 } from 'lucide-react';

interface DocumentUploaderProps {
  onReportGenerated: (reportId: string) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onReportGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      const response = await uploadFile(file);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      if (response.data?.id) {
        toast.success('Document uploaded successfully');
        setIsProcessing(true);
        
        const complianceResponse = await requestComplianceCheck(
          response.data.id,
          file.name
        );
        
        if (complianceResponse.error) {
          toast.error(complianceResponse.error);
          return;
        }
        
        if (complianceResponse.data) {
          toast.success('Compliance analysis completed');
          onReportGenerated(response.data.id);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
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
        className={`file-drop-area flex flex-col items-center justify-center p-8 ${
          isDragging ? 'dragging' : 'border-muted'
        }`}
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
        
        <div className="animate-fade-in flex flex-col items-center">
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
                  disabled={isUploading || isProcessing}
                  className="px-6"
                >
                  {isUploading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isProcessing && (
                    <div className="mr-2 flex space-x-1">
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                    </div>
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
