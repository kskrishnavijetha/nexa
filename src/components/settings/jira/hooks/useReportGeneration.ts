
import { useState } from 'react';
import { useReportToasts } from './useReportToasts';
import { useReportData } from './useReportData';
import { exportReport, ExportFormat } from '@/utils/reports';

export const useReportGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { showGeneratingToast, showSuccessToast, showErrorToast } = useReportToasts();
  const { prepareReportData } = useReportData();

  const generateReport = async (
    reportType: string,
    exportFormat: ExportFormat,
    includeCharts: boolean
  ) => {
    try {
      setIsGenerating(true);
      showGeneratingToast();

      const report = await prepareReportData(`jira-report-${Date.now()}`);
      await exportReport(report, exportFormat);
      
      showSuccessToast(reportType);
    } catch (error) {
      console.error("Error generating report:", error);
      showErrorToast();
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateReport
  };
};
