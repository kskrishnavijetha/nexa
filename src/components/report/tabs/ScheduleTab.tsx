
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
      
      <div className="text-sm text-muted-foreground mt-4">
        <p>Scheduled scans will run automatically and send email notifications even when you're signed out.</p>
      </div>
    </div>
  );
};

export default ScheduleTab;
