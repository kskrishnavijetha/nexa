
import React from 'react';
import { ComplianceReport as ComplianceReportType, RiskSeverity } from '@/utils/apiService';

interface IssuesSummaryProps {
  report: ComplianceReportType;
}

const IssuesSummary: React.FC<IssuesSummaryProps> = ({ report }) => {
  const countRisksBySeverity = (severity: RiskSeverity) => {
    return report.risks.filter(risk => risk.severity === severity).length;
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Issues Summary</h3>
      <div className="flex space-x-3">
        <div className="flex-1 p-3 rounded-lg bg-red-50 border border-red-100">
          <p className="text-center text-2xl font-bold text-red-600">
            {countRisksBySeverity('high')}
          </p>
          <p className="text-center text-sm text-red-600">High Risk</p>
        </div>
        <div className="flex-1 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <p className="text-center text-2xl font-bold text-amber-600">
            {countRisksBySeverity('medium')}
          </p>
          <p className="text-center text-sm text-amber-600">Medium Risk</p>
        </div>
        <div className="flex-1 p-3 rounded-lg bg-green-50 border border-green-100">
          <p className="text-center text-2xl font-bold text-green-600">
            {countRisksBySeverity('low')}
          </p>
          <p className="text-center text-sm text-green-600">Low Risk</p>
        </div>
      </div>
    </div>
  );
};

export default IssuesSummary;
