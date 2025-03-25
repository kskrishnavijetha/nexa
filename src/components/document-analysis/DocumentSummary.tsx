
import React from 'react';
import { ComplianceReport } from '@/utils/types';

interface DocumentSummaryProps {
  report: ComplianceReport;
}

const DocumentSummary: React.FC<DocumentSummaryProps> = ({ report }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Summary</h3>
      <p className="text-slate-700">{report.summary}</p>
    </div>
  );
};

export default DocumentSummary;
