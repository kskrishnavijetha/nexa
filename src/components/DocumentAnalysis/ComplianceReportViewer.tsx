
import React from 'react';
import { Button } from '@/components/ui/button';
import { ComplianceReport } from '@/utils/apiService';
import ReportHeader from './ReportHeader';
import ScoreOverview from './ScoreOverview';
import ReportDetails from './ReportDetails';

interface ComplianceReportViewerProps {
  report: ComplianceReport;
  isGeneratingPDF: boolean;
  onDownloadReport: () => void;
  onBack: () => void;
  onAnalyzeAnother: () => void;
}

const ComplianceReportViewer: React.FC<ComplianceReportViewerProps> = ({
  report,
  isGeneratingPDF,
  onDownloadReport,
  onBack,
  onAnalyzeAnother
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <ReportHeader 
          report={report} 
          onBack={onBack}
          onDownload={onDownloadReport}
          isGeneratingPDF={isGeneratingPDF}
        />
        
        <ScoreOverview report={report} />
        
        <ReportDetails report={report} />
      </div>
      
      <div className="mt-8 text-center">
        <Button onClick={onAnalyzeAnother}>Analyze Another Document</Button>
      </div>
    </div>
  );
};

export default ComplianceReportViewer;
