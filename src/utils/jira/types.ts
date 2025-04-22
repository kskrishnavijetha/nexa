
// Types for Jira API data

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectType: string;
  url: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  description?: string;
  status: string;
  priority: string;
  created: string;
  updated: string;
  assignee?: {
    displayName: string;
    emailAddress?: string;
    avatarUrl?: string;
  };
  reporter?: {
    displayName: string;
    emailAddress?: string;
    avatarUrl?: string;
  };
  projectId: string;
  projectKey: string;
  projectName: string;
  issueType: {
    name: string;
    iconUrl?: string;
  };
}

export interface ComplianceIssue extends JiraIssue {
  complianceFrameworks: string[];
  complianceControls: string[];
  riskScore: number; // 0-100
  keywordMatches: string[];
  isHighRisk: boolean;
  dueDate?: string;
}

export interface JiraFilter {
  projectKeys?: string[];
  statuses?: string[];
  priorities?: string[];
  onlyComplianceIssues?: boolean;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}

export interface RiskDistribution {
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface ComplianceFrameworkStats {
  framework: string; // e.g. "SOC 2", "HIPAA"
  controlsWithIssues: number;
  totalControls: number;
  percentageComplete: number;
}
