
import React from 'react';
import { ComplianceReport } from '@/utils/apiService';
import { SupportedLanguage } from '@/utils/language';
import DownloadButton from './DownloadButton';
import PreviewButton from './PreviewButton';
import { ReportProvider } from './hooks/useReportContext';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';

interface ReportActionsProps {
  report: ComplianceReport;
  language?: SupportedLanguage;
}

const ReportActions: React.FC<ReportActionsProps> = ({ report, language = 'en' }) => {
  return (
    <ReportProvider report={report}>
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <PreviewButton language={language} />
        <DownloadButton report={report} language={language} />
      </div>
    </ReportProvider>
  );
};

export default ReportActions;
