
import React, { useRef, useState } from 'react';
import { File, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateFile, formatFileSize } from '@/utils/fileUtils';
import { toast } from 'sonner';

interface GoogleFileUploaderProps {
  onFileSelect: (file: File) => void;
}

const GoogleFileUploader: React.FC<GoogleFileUploaderProps> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validation = validateFile(selectedFile);
      
      if (validation.valid) {
        setFile(selectedFile);
        onFileSelect(selectedFile);
      } else if (validation.error) {
        toast.error(validation.error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validation = validateFile(droppedFile);
      
      if (validation.valid) {
        setFile(droppedFile);
        onFileSelect(droppedFile);
      } else if (validation.error) {
        toast.error(validation.error);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
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
          accept=".pdf,.docx,.doc,.txt"
        />
        
        <div className="flex flex-col items-center">
          {file ? (
            <File className="w-8 h-8 text-primary mb-2" />
          ) : (
            <img 
              src="/lovable-uploads/7fc9f4e7-aa2b-4d74-8feb-218c9e117258.png" 
              alt="Upload icon" 
              className="w-10 h-12 text-slate-500 mb-2"
            />
          )}
          
          <h3 className="font-medium text-center">
            {file ? file.name : 'Upload your document'}
          </h3>
          
          {file && (
            <p className="text-xs text-muted-foreground mt-1">
              {formatFileSize(file.size)}
            </p>
          )}
          
          {!file && (
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Drag & drop your file here, or click to browse
            </p>
          )}
          
          {!file && (
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Supports PDF, DOCX, and TXT (up to 10MB)
            </p>
          )}

          {!file && (
            <Button onClick={triggerFileInput} variant="default" size="sm" className="mt-3">
              Select File
            </Button>
          )}
        </div>
      </div>
      
      {file && (
        <div className="flex justify-center mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={triggerFileInput}
            className="text-xs"
          >
            Change File
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoogleFileUploader;
