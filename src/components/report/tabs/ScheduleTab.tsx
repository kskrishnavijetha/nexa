
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import ScheduleScanner from '@/components/ScheduleScanner';

interface ScheduleTabProps {
  report: ComplianceReportType;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ report }) => {
  return (
    <div className="p-6 pt-4">
      <ScheduleScanner 
        documentId={report.documentId} 
        documentName={report.documentName}
        industry={report.industry}
      />
    </div>
  );
};

export default ScheduleTab;
