
import React, { useRef, DragEvent } from 'react';
import { FileText, FileUp, File } from 'lucide-react';
import { validateFile, formatFileSize } from '@/utils/fileUtils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileDropzoneProps {
  file: File | null;
  setFile: (file: File | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  file,
  setFile,
  isDragging,
  setIsDragging,
}) => {
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

        <div className="mt-6 flex gap-3">
          {!file ? (
            <Button onClick={triggerFileInput} className="px-6">
              Select File
            </Button>
          ) : (
            <Button variant="outline" onClick={triggerFileInput} size="sm">
              Change File
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileDropzone;
