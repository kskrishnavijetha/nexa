
import { ComplianceIssue } from '@/utils/jira/types';
import { ComplianceReport, ComplianceRisk, Industry, Region } from '@/utils/types';

export const mapIssueToRisk = (issue: ComplianceIssue): ComplianceRisk => ({
  title: issue.summary,
  severity: (issue.priority === "High" ? "high" : 
           issue.priority === "Medium" ? "medium" : "low"),
  description: issue.description || "",
  regulation: issue.complianceFrameworks?.join(", ") || "Unknown",
  status: issue.isHighRisk ? "critical" : "warning"
});

export const getDefaultRecommendations = (): string[] => [
  "Improve password policies",
  "Enhance data encryption standards",
  "Update security awareness training"
];

export const createComplianceReport = (
  documentId: string,
  issues: ComplianceIssue[]
): ComplianceReport => ({
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
  risks: issues.map(mapIssueToRisk),
  recommendations: getDefaultRecommendations()
});
