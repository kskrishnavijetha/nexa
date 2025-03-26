
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (files: File[]) => void;
  serviceId: string;
  dialogTitle?: string;
  dialogDescription?: string;
  submitButtonText?: string;
  allowMultiple?: boolean;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  serviceId,
  dialogTitle = 'Upload Document',
  dialogDescription = 'Select a document to upload for compliance scanning',
  submitButtonText = 'Upload & Scan',
  allowMultiple = false
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      setSelectedFiles(allowMultiple ? files : [files[0]]);
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select a file first");
      return;
    }

    setIsLoading(true);
    await onSubmit(selectedFiles);
    setIsLoading(false);
    setSelectedFiles([]);
    onClose();
  };

  const resetDialog = () => {
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            multiple={allowMultiple}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-blue-600">
              Click to select {allowMultiple ? 'files' : 'a file'}
            </span>
            <span className="text-xs text-gray-500">
              Supports PDF, Office documents, plain text, and images
            </span>
          </label>
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Selected {selectedFiles.length > 1 ? `${selectedFiles.length} files` : 'file'}:</p>
            <div className="max-h-28 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 py-1">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={resetDialog}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
