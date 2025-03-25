
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import ComplianceDetailsTab from '@/components/report/ComplianceDetailsTab';
import { SupportedLanguage } from '@/utils/language';

interface ReportDetailsTabProps {
  report: ComplianceReportType;
  onClose: () => void;
  language: SupportedLanguage;
}

const ReportDetailsTab: React.FC<ReportDetailsTabProps> = ({ 
  report, 
  onClose,
  language 
}) => {
  return <ComplianceDetailsTab report={report} onClose={onClose} language={language} />;
};

export default ReportDetailsTab;
