
import React from 'react';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComplianceReport } from '@/utils/apiService';

interface ReportHeaderProps {
  report: ComplianceReport;
  onBack: () => void;
  onDownload: () => void;
  isGeneratingPDF: boolean;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ report, onBack, onDownload, isGeneratingPDF }) => {
  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Document Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Upload a document to analyze compliance with various industry regulations
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold">{report.documentName}</h2>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center" 
          onClick={onDownload}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? (
            <>
              <span className="animate-spin mr-2">⏳</span> Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Download PDF Report
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default ReportHeader;
