
import { jiraIssueService } from '@/utils/jira/jiraIssueService';
import { ComplianceReport, Industry, Region, RiskSeverity } from '@/utils/types';

export const useReportData = () => {
  const prepareReportData = async (documentId: string): Promise<ComplianceReport> => {
    const issues = await jiraIssueService.getComplianceIssues();
    
    return {
      documentId,
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
      recommendations: [
        "Improve password policies",
        "Enhance data encryption standards", 
        "Update security awareness training"
      ]
    };
  };

  return { prepareReportData };
};
