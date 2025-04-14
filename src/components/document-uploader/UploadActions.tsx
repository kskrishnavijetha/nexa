
import React from 'react';
import { Button } from '@/components/ui/button';
import { Industry, Region } from '@/utils/apiService';
import { UploadCloud, Loader2 } from 'lucide-react';

interface UploadActionsProps {
  file: File | null;
  industry?: Industry;
  region?: Region;
  frameworks?: string[];
  isUploading: boolean;
  isProcessing: boolean;
  onUpload: () => void;
}

const UploadActions: React.FC<UploadActionsProps> = ({
  file,
  industry,
  region,
  frameworks = [],
  isUploading,
  isProcessing,
  onUpload
}) => {
  const isDisabled = !file || isUploading || isProcessing || !industry;
  
  return (
    <>
      <Button
        onClick={onUpload}
        disabled={isDisabled}
        className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
        size="lg"
      >
        {isUploading || isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isUploading ? 'Uploading...' : 'Analyzing...'}
          </>
        ) : (
          <>
            <UploadCloud className="h-4 w-4" />
            {frameworks && frameworks.length > 1 
              ? `Analyze Against ${frameworks.length} Frameworks` 
              : 'Analyze Document'}
          </>
        )}
      </Button>
    </>
  );
};

export default UploadActions;
