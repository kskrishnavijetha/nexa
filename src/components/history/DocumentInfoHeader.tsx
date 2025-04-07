
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

interface DocumentInfoHeaderProps {
  documentName: string;
  score: number;
  isDownloading: boolean;
  onDownload: () => void;
  onPreview: () => void;
}

const DocumentInfoHeader: React.FC<DocumentInfoHeaderProps> = ({
  documentName,
  score,
  isDownloading,
  onDownload,
  onPreview
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <h3 className="text-lg font-medium">{documentName}</h3>
        <span className={`ml-2 font-semibold ${getScoreColor(score)}`}>
          {score}%
        </span>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" /> Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          disabled={isDownloading}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          {isDownloading ? 'Downloading...' : 'Download Report'}
        </Button>
      </div>
    </div>
  );
};

export default DocumentInfoHeader;
