
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import { SupportedLanguage, translate } from '@/utils/languageService';

interface ComplianceScoresProps {
  report: ComplianceReportType;
  language?: SupportedLanguage;
}

const ComplianceScores: React.FC<ComplianceScoresProps> = ({ report, language = 'en' }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="rounded-lg border p-4 text-center">
        <div className={`text-2xl font-bold mb-1 ${getScoreColor(report.gdprScore)}`}>
          {report.gdprScore}%
        </div>
        <p className="text-sm">{translate('gdpr_compliance', language).replace(' Compliance', '')}</p>
      </div>
      <div className="rounded-lg border p-4 text-center">
        <div className={`text-2xl font-bold mb-1 ${getScoreColor(report.hipaaScore)}`}>
          {report.hipaaScore}%
        </div>
        <p className="text-sm">{translate('hipaa_compliance', language).replace(' Compliance', '')}</p>
      </div>
      <div className="rounded-lg border p-4 text-center">
        <div className={`text-2xl font-bold mb-1 ${getScoreColor(report.soc2Score)}`}>
          {report.soc2Score}%
        </div>
        <p className="text-sm">{translate('soc2_compliance', language).replace(' Compliance', '')}</p>
      </div>
    </div>
  );
};

export default ComplianceScores;
