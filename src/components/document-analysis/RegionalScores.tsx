
import React from 'react';
import { ComplianceReport } from '@/utils/types';

interface RegionalScoresProps {
  report: ComplianceReport;
}

const RegionalScores: React.FC<RegionalScoresProps> = ({ report }) => {
  if (!report.regionScores || Object.keys(report.regionScores).length === 0) {
    return null;
  }
  
  return (
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
  );
};

export default RegionalScores;
