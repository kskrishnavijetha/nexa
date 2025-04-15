
import React, { useState, useRef, DragEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Upload, File, FilePdf, FileJson, FileText } from 'lucide-react';
import { formatFileSize } from '@/utils/fileUtils';

// Maximum file size: 20MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'application/json', 'text/plain'];

interface HashFileUploaderProps {
  onFileSelect: (file: File) => void;
  file: File | null;
}

const HashFileUploader: React.FC<HashFileUploaderProps> = ({ onFileSelect, file }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (selectedFile: File): boolean => {
    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds the maximum limit of 20MB`);
      return false;
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error('Invalid file type. Please upload a PDF, JSON, or text file');
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (validateFile(selectedFile)) {
        onFileSelect(selectedFile);
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
      
      if (validateFile(droppedFile)) {
        onFileSelect(droppedFile);
      }
    }
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="w-12 h-12 text-muted-foreground" />;
    
    switch(file.type) {
      case 'application/pdf':
        return <FilePdf className="w-12 h-12 text-red-500" />;
      case 'application/json':
        return <FileJson className="w-12 h-12 text-yellow-500" />;
      case 'text/plain':
        return <FileText className="w-12 h-12 text-blue-500" />;
      default:
        return <File className="w-12 h-12 text-gray-500" />;
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg ${
        isDragging ? 'border-primary bg-primary/5' : 'border-muted'
      } flex flex-col items-center justify-center p-6`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        accept=".pdf,.json,.txt"
      />
      
      <div className="flex flex-col items-center text-center">
        {getFileIcon()}
        
        <h3 className="mt-4 font-semibold text-lg">
          {file ? file.name : 'Upload document for verification'}
        </h3>
        
        {file && (
          <p className="text-sm text-muted-foreground mt-1">
            {formatFileSize(file.size)}
          </p>
        )}
        
        {!file && (
          <p className="text-sm text-muted-foreground mt-2">
            Drag & drop your file here, or click to browse
            <br />
            <span className="text-xs">
              Support for PDF, JSON, and TXT files (up to 20MB)
            </span>
          </p>
        )}

        <div className="mt-4">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant={file ? "outline" : "default"}
            size="sm"
          >
            {file ? 'Change File' : 'Select File'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HashFileUploader;
