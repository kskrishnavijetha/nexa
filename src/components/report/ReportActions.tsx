
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { ComplianceReport as ComplianceReportType, generateReportPDF } from '@/utils/apiService';

interface ReportActionsProps {
  report: ComplianceReportType;
  onClose: () => void;
}

const ReportActions: React.FC<ReportActionsProps> = ({ report, onClose }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const response = await generateReportPDF(report);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Report downloaded successfully');
        // In a real app, this would trigger the download
      }
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex mb-6 gap-4">
      <Button 
        onClick={handleGeneratePDF} 
        className="flex-1"
        disabled={isGeneratingPdf}
      >
        {isGeneratingPdf ? (
          <span className="flex items-center">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <span className="ml-2">Generating...</span>
          </span>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download Full Report
          </>
        )}
      </Button>
      <Button 
        variant="outline" 
        onClick={onClose}
      >
        Analyze Another Document
      </Button>
    </div>
  );
};

export default ReportActions;
