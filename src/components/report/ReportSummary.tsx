
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';

interface ReportSummaryProps {
  report: ComplianceReportType;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ report }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Summary</h3>
      <p className="text-muted-foreground">{report.summary}</p>
    </div>
  );
};

export default ReportSummary;
