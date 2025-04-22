
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExportFormat } from '@/utils/reports';
import ReportConfigForm from './components/ReportConfigForm';
import GenerateReportButton from './components/GenerateReportButton';
import { useReportGeneration } from './hooks/useReportGeneration';

const JiraReports = () => {
  const [reportType, setReportType] = useState('compliance-summary');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const { isGenerating, generateReport } = useReportGeneration();

  const handleGenerateReport = () => {
    generateReport(reportType, exportFormat, includeCharts);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Reports</CardTitle>
        <CardDescription>
          Generate reports showing Jira issues mapped to compliance frameworks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReportConfigForm
          reportType={reportType}
          exportFormat={exportFormat}
          includeCharts={includeCharts}
          onReportTypeChange={setReportType}
          onExportFormatChange={setExportFormat}
          onIncludeChartsChange={setIncludeCharts}
        />
      </CardContent>
      <CardFooter>
        <GenerateReportButton
          isGenerating={isGenerating}
          onClick={handleGenerateReport}
        />
      </CardFooter>
    </Card>
  );
};

export default JiraReports;
