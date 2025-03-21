
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import ReportActions from './ReportActions';
import ComplianceScores from './ComplianceScores';
import IssuesSummary from './IssuesSummary';
import ReportSummary from './ReportSummary';
import RegulationRisks from './RegulationRisks';

interface ComplianceDetailsTabProps {
  report: ComplianceReportType;
  onClose: () => void;
}

const ComplianceDetailsTab: React.FC<ComplianceDetailsTabProps> = ({ report, onClose }) => {
  return (
    <div className="p-6 pt-4">
      <ReportActions report={report} onClose={onClose} />
      <ComplianceScores report={report} />
      <IssuesSummary report={report} />
      <ReportSummary report={report} />
      
      <div className="grid grid-cols-1 gap-6">
        <RegulationRisks 
          report={report} 
          regulation="GDPR" 
          title="GDPR Compliance" 
          colorClass="text-blue-600" 
        />
        
        <RegulationRisks 
          report={report} 
          regulation="HIPAA" 
          title="HIPAA Compliance" 
          colorClass="text-purple-600" 
        />
        
        <RegulationRisks 
          report={report} 
          regulation="SOC2" 
          title="SOC 2 Compliance" 
          colorClass="text-emerald-600" 
        />
      </div>
    </div>
  );
};

export default ComplianceDetailsTab;
