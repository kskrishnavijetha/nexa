
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import ReportHeader from './report/ReportHeader';
import ReportTabs from './report/ReportTabs';
import useLanguagePreference from '@/hooks/useLanguagePreference';

interface ComplianceReportProps {
  report: ComplianceReportType;
  onClose: () => void;
}

const ComplianceReportComponent: React.FC<ComplianceReportProps> = ({ report, onClose }) => {
  const { language, setLanguage } = useLanguagePreference();

  return (
    <div className="animate-fade-up bg-background rounded-xl border shadow-soft overflow-hidden max-w-3xl w-full mx-auto">
      <ReportHeader 
        report={report} 
        language={language} 
        onBack={onClose}
      />
      <ReportTabs 
        report={report} 
        onClose={onClose} 
        language={language} 
        setLanguage={setLanguage}
      />
    </div>
  );
};

export default ComplianceReportComponent;
