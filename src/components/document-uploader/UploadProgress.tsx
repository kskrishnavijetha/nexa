
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  isUploading: boolean;
  isProcessing: boolean;
  progress: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  isUploading,
  isProcessing,
  progress,
}) => {
  if (!isUploading && !isProcessing) return null;

  return (
    <div className="w-full mt-4">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-center mt-2 text-muted-foreground">
        {isUploading ? 'Uploading document...' : 'Analyzing compliance...'}
        {' '}{Math.round(progress)}%
      </p>
    </div>
  );
};

export default UploadProgress;
