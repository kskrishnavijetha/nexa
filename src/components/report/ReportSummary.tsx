
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import { SupportedLanguage, translate } from '@/utils/languageService';

interface ReportSummaryProps {
  report: ComplianceReportType;
  language?: SupportedLanguage;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ report, language = 'en' }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{translate('summary', language)}</h3>
      <p className="text-muted-foreground">{report.summary}</p>
    </div>
  );
};

export default ReportSummary;
