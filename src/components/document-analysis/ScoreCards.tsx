
import React from 'react';
import { ComplianceReport } from '@/utils/types';

interface ScoreCardsProps {
  report: ComplianceReport;
}

const ScoreCards: React.FC<ScoreCardsProps> = ({ report }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-50 p-4 rounded">
        <p className="text-sm text-muted-foreground">Overall Score</p>
        <p className="text-2xl font-bold text-slate-900">{report.overallScore}%</p>
      </div>
      <div className="bg-slate-50 p-4 rounded">
        <p className="text-sm text-muted-foreground">GDPR</p>
        <p className="text-2xl font-bold text-slate-900">{report.gdprScore}%</p>
      </div>
      <div className="bg-slate-50 p-4 rounded">
        <p className="text-sm text-muted-foreground">HIPAA</p>
        <p className="text-2xl font-bold text-slate-900">{report.hipaaScore}%</p>
      </div>
      <div className="bg-slate-50 p-4 rounded">
        <p className="text-sm text-muted-foreground">SOC 2</p>
        <p className="text-2xl font-bold text-slate-900">{report.soc2Score}%</p>
      </div>
    </div>
  );
};

export default ScoreCards;
