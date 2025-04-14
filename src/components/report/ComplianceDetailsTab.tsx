
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import { Button } from '@/components/ui/button';
import ComplianceScores from './ComplianceScores';
import ReportSummary from './ReportSummary';
import IssuesSummary from './IssuesSummary';
import RegulationRisks from './RegulationRisks';
import ReportActions from './ReportActions';
import { SupportedLanguage } from '@/utils/language';
import ComplianceDisclaimer from './ComplianceDisclaimer';
import RegionalScores from '@/components/document-analysis/RegionalScores';

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
      
      {/* Add Regional Compliance Scores */}
      {report.regionScores && Object.keys(report.regionScores).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Regional Compliance Scores</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(report.regionScores).map(([regulation, score]) => (
              <div key={regulation} className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-blue-700">{regulation}</p>
                <p className="text-2xl font-bold text-blue-900">{score}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
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
          regulation="SOC2" 
          title="SOC 2 Compliance" 
          colorClass="text-teal-600"
          language={language}
        />
      </div>
      
      <ReportActions report={report} language={language} />
      
      <ComplianceDisclaimer language={language} />
      
      <div className="flex justify-end mt-8">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default ComplianceDetailsTab;
