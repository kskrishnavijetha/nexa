
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import ScheduleScanner from '@/components/ScheduleScanner';
import ComplianceDisclaimer from '@/components/report/ComplianceDisclaimer';

interface ScheduleTabProps {
  report: ComplianceReportType;
  language?: string;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ report, language = 'en' }) => {
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
      
      <ComplianceDisclaimer language={language} compact={true} className="mt-8" />
    </div>
  );
};

export default ScheduleTab;
