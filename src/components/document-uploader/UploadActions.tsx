
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface UploadActionsProps {
  file: File | null;
  industry: string | undefined;
  isUploading: boolean;
  isProcessing: boolean;
  onUpload: () => void;
}

const UploadActions: React.FC<UploadActionsProps> = ({
  file,
  industry,
  isUploading,
  isProcessing,
  onUpload,
}) => {
  if (!file) return null;

  return (
    <Button 
      onClick={onUpload} 
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
  );
};

export default UploadActions;
