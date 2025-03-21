
import React from 'react';
import { Industry, Region } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';

interface UploadActionsProps {
  file: File | null;
  industry?: Industry;
  region?: Region;
  isUploading: boolean;
  isProcessing: boolean;
  onUpload: () => void;
  onClear?: () => void;
}

const UploadActions: React.FC<UploadActionsProps> = ({
  file,
  industry,
  region,
  isUploading,
  isProcessing,
  onUpload,
  onClear
}) => {
  if (!file) return null;

  return (
    <>
      <Button
        onClick={onUpload}
        disabled={isUploading || isProcessing}
        className="flex items-center"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Analyze Document
          </>
        )}
      </Button>

      {onClear && (
        <Button
          variant="outline"
          onClick={onClear}
          disabled={isUploading || isProcessing}
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </>
  );
};

export default UploadActions;
