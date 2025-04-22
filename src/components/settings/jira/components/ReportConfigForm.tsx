
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExportFormat } from '@/utils/reports';

interface ReportConfigFormProps {
  reportType: string;
  exportFormat: ExportFormat;
  includeCharts: boolean;
  onReportTypeChange: (value: string) => void;
  onExportFormatChange: (value: ExportFormat) => void;
  onIncludeChartsChange: (value: boolean) => void;
}

const ReportConfigForm = ({
  reportType,
  exportFormat,
  includeCharts,
  onReportTypeChange,
  onExportFormatChange,
  onIncludeChartsChange,
}: ReportConfigFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select 
            defaultValue={reportType}
            onValueChange={onReportTypeChange}
          >
            <SelectTrigger id="report-type">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compliance-summary">Compliance Summary</SelectItem>
              <SelectItem value="framework-mapping">Framework Mapping</SelectItem>
              <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
              <SelectItem value="remediation-plan">Remediation Plan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="export-format">Export Format</Label>
          <Select 
            defaultValue={exportFormat}
            onValueChange={(value) => onExportFormatChange(value as ExportFormat)}
          >
            <SelectTrigger id="export-format">
              <SelectValue placeholder="Select export format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="docx">Word Document (DOCX)</SelectItem>
              <SelectItem value="csv">CSV Spreadsheet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <Label htmlFor="include-charts" className="block">Include Visualizations</Label>
            <p className="text-sm text-muted-foreground">Add charts and graphs to the report</p>
          </div>
          <Switch
            id="include-charts"
            checked={includeCharts}
            onCheckedChange={onIncludeChartsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportConfigForm;
