
export interface JiraSettings {
  connected: boolean;
  domain: string;
  email: string;
  apiToken: string;
  projectKey: string;
  issueType: string;
  createIssuesForHighRiskOnly: boolean;
  createIssuesForViolations: boolean;
  createIssuesForRisks: boolean;
  createIssuesForAuditEntries: boolean;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
}

export interface JiraIssueType {
  id: string;
  name: string;
  description?: string;
}
