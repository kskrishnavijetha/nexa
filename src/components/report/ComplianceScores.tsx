
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';

interface ComplianceScoresProps {
  report: ComplianceReportType;
}

const ComplianceScores: React.FC<ComplianceScoresProps> = ({ report }) => {
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
        <p className="text-sm">GDPR</p>
      </div>
      <div className="rounded-lg border p-4 text-center">
        <div className={`text-2xl font-bold mb-1 ${getScoreColor(report.hipaaScore)}`}>
          {report.hipaaScore}%
        </div>
        <p className="text-sm">HIPAA</p>
      </div>
      <div className="rounded-lg border p-4 text-center">
        <div className={`text-2xl font-bold mb-1 ${getScoreColor(report.soc2Score)}`}>
          {report.soc2Score}%
        </div>
        <p className="text-sm">SOC 2</p>
      </div>
    </div>
  );
};

export default ComplianceScores;
