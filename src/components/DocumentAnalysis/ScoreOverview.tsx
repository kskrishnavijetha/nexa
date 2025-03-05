
import React from 'react';
import { ComplianceReport } from '@/utils/apiService';

interface ScoreOverviewProps {
  report: ComplianceReport;
}

const ScoreOverview: React.FC<ScoreOverviewProps> = ({ report }) => {
  return (
    <>
      {report.industry && (
        <div className="mb-4">
          <div className="bg-slate-100 p-3 rounded">
            <h3 className="font-medium text-slate-700">Industry: {report.industry}</h3>
            {report.regulations && report.regulations.length > 0 && (
              <p className="text-sm text-slate-600 mt-1">
                Applicable Regulations: {report.regulations.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
      
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
      
      {/* Display industry-specific scores if available */}
      {report.industryScores && Object.keys(report.industryScores).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Industry-Specific Scores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(report.industryScores).map(([regulation, score]) => (
              <div key={regulation} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                <p className="text-sm text-muted-foreground">{regulation}</p>
                <p className="text-xl font-bold text-slate-900">{score}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ScoreOverview;
