
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

      // Prepare the report data first
      const report = await prepareReportData(`jira-report-${Date.now()}`);
      
      // Capture chart if needed
      let chartImage: string | undefined;
      if (includeCharts) {
        chartImage = await captureChartImage();
      }
      
      // Export the report in the selected format
      await exportReport(report, exportFormat, chartImage);
      
      showSuccessToast(reportType);
    } catch (error) {
      console.error("Error generating report:", error);
      showErrorToast();
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to capture chart image if available
  const captureChartImage = async (): Promise<string | undefined> => {
    try {
      // Look for chart container in the document
      const chartContainer = document.querySelector('.jira-compliance-chart');
      
      if (!chartContainer) {
        console.warn('No chart container found to capture');
        return undefined;
      }
      
      // Use html2canvas to capture the chart
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(chartContainer as HTMLElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing chart:', error);
      return undefined;
    }
  };

  return {
    isGenerating,
    generateReport
  };
};
