
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import { Button } from '@/components/ui/button';
import ComplianceScores from './ComplianceScores';
import ReportSummary from './ReportSummary';
import IssuesSummary from './IssuesSummary';
import RegulationRisks from './RegulationRisks';
import ReportActions from './ReportActions';
import { SupportedLanguage } from '@/utils/language';

interface ComplianceDetailsTabProps {
  report: ComplianceReportType;
  onClose: () => void;
  language?: SupportedLanguage;
}

const ComplianceDetailsTab: React.FC<ComplianceDetailsTabProps> = ({ 
  report, 
  onClose,
  language = 'en'
}) => {
  return (
    <div className="p-6 pt-4">
      <ComplianceScores report={report} language={language} />
      <ReportSummary report={report} language={language} />
      <IssuesSummary report={report} language={language} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <RegulationRisks 
          report={report} 
          regulation="GDPR" 
          title="GDPR Compliance" 
          colorClass="text-blue-600"
          language={language}
        />
        <RegulationRisks 
          report={report} 
          regulation="HIPAA" 
          title="HIPAA Compliance" 
          colorClass="text-purple-600"
          language={language}
        />
        <RegulationRisks 
          report={report} 
          regulation="SOC 2" 
          title="SOC 2 Compliance" 
          colorClass="text-teal-600"
          language={language}
        />
      </div>
      
      <ReportActions report={report} language={language} />
      
      <div className="flex justify-end mt-8">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default ComplianceDetailsTab;
