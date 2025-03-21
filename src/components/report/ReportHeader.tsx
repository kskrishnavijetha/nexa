import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import { SupportedLanguage, translate } from '@/utils/language';

interface ReportHeaderProps {
  report: ComplianceReportType;
  language?: SupportedLanguage;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ report, language = 'en' }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="p-6 border-b bg-muted/30">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">{report.documentName}</h2>
          <p className="text-muted-foreground">
            {translate('generated', language)}: {new Date(report.timestamp).toLocaleString(language)}
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1 transition-colors">
            <span className={getScoreColor(report.overallScore)}>
              {report.overallScore}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{translate('overall_compliance', language)}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
