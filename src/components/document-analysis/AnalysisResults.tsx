
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ComplianceReport } from '@/utils/types';
import DocumentInfoHeader from './DocumentInfoHeader';
import DocumentMetadata from './DocumentMetadata';
import ScoreCards from './ScoreCards';
import RegionalScores from './RegionalScores';
import ComplianceCharts from '@/components/ComplianceCharts';
import RiskAnalysis from '@/components/RiskAnalysis';
import Simulation from '@/components/simulation/Simulation';
import DocumentSummary from './DocumentSummary';
import ImprovementSuggestions from './ImprovementSuggestions';
import AuditTrail from '@/components/AuditTrail';
import DocumentPreview from './DocumentPreview';
import { useJiraIntegration } from '@/hooks/useJiraIntegration';

interface AnalysisResultsProps {
  report: ComplianceReport;
  isGeneratingPDF: boolean;
  onDownloadReport: () => void;
  onResetAnalysis: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  report,
  isGeneratingPDF,
  onDownloadReport,
  onResetAnalysis
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { createIssuesForReport, isEnabled: isJiraEnabled } = useJiraIntegration();
  
  // Create Jira issues when analysis is complete
  useEffect(() => {
    if (isJiraEnabled() && report && report.risks.length > 0) {
      // Only try to create issues if Jira integration is enabled
      createIssuesForReport(report);
    }
  }, [createIssuesForReport, isJiraEnabled, report]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <DocumentInfoHeader 
          report={report} 
          isGeneratingPDF={isGeneratingPDF} 
          onDownloadReport={onDownloadReport}
          onPreviewReport={() => setPreviewOpen(true)}
        />
        
        <DocumentMetadata report={report} />
        
        <ScoreCards report={report} />
        
        <RegionalScores report={report} />
        
        <ComplianceCharts report={report} />
        
        <RiskAnalysis risks={report.risks} />
        
        <div className="mb-6">
          <Simulation report={report} />
        </div>
        
        <DocumentSummary report={report} />
        
        <ImprovementSuggestions report={report} />
        
        <AuditTrail documentName={report.documentName} />
      </div>
      
      <div className="mt-8 text-center">
        <Button onClick={onResetAnalysis}>Analyze Another Document</Button>
      </div>

      <DocumentPreview 
        report={report}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};

export default AnalysisResults;
