
import React from 'react';
import { FileText } from 'lucide-react';

interface FileInfoDisplayProps {
  fileName: string;
  serviceName?: string;
}

const FileInfoDisplay: React.FC<FileInfoDisplayProps> = ({ fileName, serviceName }) => {
  if (!fileName) return null;
  
  return (
    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center">
      <FileText className="h-4 w-4 text-blue-500 mr-2" />
      <div>
        <p className="font-medium text-sm">{fileName}</p>
        {serviceName && <p className="text-xs text-muted-foreground">Uploaded to {serviceName}</p>}
      </div>
    </div>
  );
};

export default FileInfoDisplay;
