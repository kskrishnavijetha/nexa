
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { jiraIssueService } from '@/utils/jira/jiraIssueService';
import { exportReport, ExportFormat } from '@/utils/reports';
import { Industry, Region, RiskSeverity } from '@/utils/types';

export const useReportGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateReport = async (
    reportType: string,
    exportFormat: ExportFormat,
    includeCharts: boolean
  ) => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating report",
        description: "Please wait while we prepare your report...",
      });

      const issues = await jiraIssueService.getComplianceIssues();
      
      const report = {
        documentId: `jira-report-${Date.now()}`,
        documentName: `Jira Compliance Report - ${new Date().toLocaleDateString()}`,
        summary: "This report summarizes compliance-related issues from Jira.",
        overallScore: 75,
        gdprScore: 70,
        hipaaScore: 75,
        soc2Score: 80,
        pciDssScore: 65,
        industry: "Technology" as Industry,
        region: "Global" as Region,
        regulations: ["SOC 2", "GDPR", "HIPAA"],
        risks: issues.map(issue => ({
          title: issue.summary,
          severity: (issue.priority === "High" ? "high" : 
                   issue.priority === "Medium" ? "medium" : "low") as RiskSeverity,
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

  return {
    isGenerating,
    generateReport
  };
};
