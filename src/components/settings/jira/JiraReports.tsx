
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Download, FileText } from 'lucide-react';
import { exportReport, ExportFormat } from '@/utils/reports';
import { JiraIssue } from '@/utils/jira/types';
import { jiraIssueService } from '@/utils/jira/jiraIssueService';
import { Industry, RiskSeverity } from '@/utils/types';

const JiraReports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('compliance-summary');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating report",
        description: "Please wait while we prepare your report...",
      });

      // Fetch compliance issues to include in the report
      const issues = await jiraIssueService.getComplianceIssues();
      
      // Create a report structure that matches the ComplianceReport type
      // Ensure industry is properly typed as Industry from the imported type
      const report = {
        documentId: `jira-report-${Date.now()}`, // Required by ComplianceReport
        documentName: `Jira Compliance Report - ${new Date().toLocaleDateString()}`,
        summary: "This report summarizes compliance-related issues from Jira.",
        overallScore: 75,
        gdprScore: 70, // Required by ComplianceReport
        hipaaScore: 75, // Required by ComplianceReport
        soc2Score: 80, // Required by ComplianceReport
        pciDssScore: 65, // Optional in ComplianceReport
        industry: "Technology" as Industry, // Cast to Industry type
        region: "Global",
        regulations: ["SOC 2", "GDPR", "HIPAA"],
        risks: issues.map(issue => ({
          title: issue.summary,
          severity: (issue.priority === "High" ? "high" : 
                   (issue.priority === "Medium" ? "medium" : "low")) as RiskSeverity,
          description: issue.description || "",
          regulation: issue.complianceFrameworks?.join(", ") || "Unknown",
          status: issue.isHighRisk ? "critical" : "warning"
        })),
        scores: {
          overall: 75,
          byCategory: {
            "Access Control": 80,
            "Data Protection": 70,
            "Incident Response": 85,
            "Risk Assessment": 65
          }
        },
        improvements: [
          "Improve password policies",
          "Enhance data encryption standards",
          "Update security awareness training"
        ]
      };

      // Generate and download the report
      await exportReport(report, exportFormat);
      
      toast({
        title: "Report generated",
        description: `Your ${reportType} report has been downloaded.`,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Reports</CardTitle>
        <CardDescription>
          Generate reports showing Jira issues mapped to compliance frameworks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select 
              defaultValue={reportType}
              onValueChange={setReportType}
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
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
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
              onCheckedChange={setIncludeCharts}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="flex items-center gap-2"
          onClick={handleGenerateReport}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Generate Report</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JiraReports;
