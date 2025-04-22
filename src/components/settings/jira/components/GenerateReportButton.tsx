
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface GenerateReportButtonProps {
  isGenerating: boolean;
  onClick: () => void;
}

const GenerateReportButton = ({ isGenerating, onClick }: GenerateReportButtonProps) => {
  return (
    <Button
      className="flex items-center gap-2"
      onClick={onClick}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Generate Report</span>
        </>
      )}
    </Button>
  );
};

export default GenerateReportButton;
