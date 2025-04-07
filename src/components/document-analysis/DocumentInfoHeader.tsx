
import React from 'react';
import { FileText, Download, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComplianceReport } from '@/utils/types';

interface DocumentInfoHeaderProps {
  report: ComplianceReport;
  isGeneratingPDF: boolean;
  onDownloadReport: () => void;
  onPreviewReport: () => void;
}

const DocumentInfoHeader: React.FC<DocumentInfoHeaderProps> = ({ 
  report, 
  isGeneratingPDF, 
  onDownloadReport,
  onPreviewReport
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <FileText className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold">{report.documentName}</h2>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="flex items-center" 
          onClick={onPreviewReport}
        >
          <Eye className="mr-2 h-4 w-4" /> Preview
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center" 
          onClick={onDownloadReport}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Download PDF Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentInfoHeader;
