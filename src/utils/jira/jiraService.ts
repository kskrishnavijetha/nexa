
import { toast } from 'sonner';
import { JiraSettings, JiraProject, JiraIssueType } from '@/components/settings/jira/types';
import { ComplianceRisk, ComplianceReport } from '@/utils/types';
import { AuditEvent } from '@/components/audit/types';

// Base API URL builder
const getJiraApiUrl = (domain: string) => `https://${domain}/rest/api/2`;

// API request helper with auth
const jiraRequest = async (
  url: string,
  settings: JiraSettings,
  options: RequestInit = {}
) => {
  const headers = {
    'Authorization': `Basic ${btoa(`${settings.email}:${settings.apiToken}`)}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Jira API Error: ${error}`);
  }

  return response.json();
};

// Test connection to Jira
export const testJiraConnection = async (settings: JiraSettings): Promise<boolean> => {
  try {
    const url = `${getJiraApiUrl(settings.domain)}/myself`;
    await jiraRequest(url, settings);
    return true;
  } catch (error) {
    console.error('[Jira] Connection test failed:', error);
    return false;
  }
};

// Fetch available projects
export const fetchJiraProjects = async (settings: JiraSettings): Promise<JiraProject[]> => {
  try {
    const url = `${getJiraApiUrl(settings.domain)}/project`;
    const projects = await jiraRequest(url, settings);
    return projects.map((p: any) => ({
      id: p.id,
      key: p.key,
      name: p.name
    }));
  } catch (error) {
    console.error('[Jira] Error fetching projects:', error);
    return [];
  }
};

// Fetch issue types for a project
export const fetchJiraIssueTypes = async (settings: JiraSettings): Promise<JiraIssueType[]> => {
  try {
    const url = `${getJiraApiUrl(settings.domain)}/project/${settings.projectKey}/issuetypes`;
    const issueTypes = await jiraRequest(url, settings);
    return issueTypes.map((t: any) => ({
      id: t.id,
      name: t.name,
      description: t.description
    }));
  } catch (error) {
    console.error('[Jira] Error fetching issue types:', error);
    return [];
  }
};

// Create a Jira issue
const createJiraIssue = async (
  settings: JiraSettings,
  fields: {
    summary: string;
    description: string;
    issuetype: { id: string };
    project: { key: string };
  }
): Promise<boolean> => {
  try {
    const url = `${getJiraApiUrl(settings.domain)}/issue`;
    await jiraRequest(url, settings, {
      method: 'POST',
      body: JSON.stringify({ fields })
    });
    return true;
  } catch (error) {
    console.error('[Jira] Error creating issue:', error);
    toast.error('Failed to create Jira issue');
    return false;
  }
};

// Format issue description in Jira markup
const formatJiraDescription = ({
  description,
  documentName,
  framework,
  riskLevel,
  remediation
}: {
  description: string;
  documentName: string;
  framework: string;
  riskLevel: string;
  remediation: string;
}): string => {
  return `
h2. Compliance Issue Details

*Document:* ${documentName}
*Framework Violated:* ${framework}
*Risk Level:* ${riskLevel}

h3. Description
${description}

h3. Suggested Remediation
${remediation}

----
_This issue was automatically created by NexaBloom_
`;
};

// Create issue for a compliance risk
export const createJiraIssueForRisk = async (
  risk: ComplianceRisk,
  documentName: string
): Promise<boolean> => {
  const settings = getJiraSettings();
  if (!isJiraConfigured(settings)) {
    return false;
  }

  if (settings.createIssuesForHighRiskOnly && risk.severity !== 'high') {
    return false;
  }

  const issueFields = {
    project: { key: settings.projectKey },
    issuetype: { id: settings.issueType },
    summary: `[${risk.severity.toUpperCase()}] ${risk.title} - ${documentName}`,
    description: formatJiraDescription({
      description: risk.description,
      documentName,
      framework: risk.regulation || 'Not specified',
      riskLevel: risk.severity,
      remediation: risk.mitigation || 'No specific remediation steps provided'
    })
  };

  return await createJiraIssue(settings, issueFields);
};

// Create issue for an audit event
export const createJiraIssueForAuditEvent = async (
  event: AuditEvent
): Promise<boolean> => {
  const settings = getJiraSettings();
  if (!isJiraConfigured(settings) || !settings.createIssuesForAuditEntries) {
    return false;
  }

  if (event.status !== 'critical') {
    return false;
  }

  const issueFields = {
    project: { key: settings.projectKey },
    issuetype: { id: settings.issueType },
    summary: `[CRITICAL AUDIT] ${event.action} - ${event.documentName}`,
    description: formatJiraDescription({
      description: event.action,
      documentName: event.documentName,
      framework: 'Audit Trail',
      riskLevel: 'critical',
      remediation: 'Review the audit trail and take appropriate action'
    })
  };

  return await createJiraIssue(settings, issueFields);
};

// Create issues for compliance report
export const createJiraIssuesForReport = async (
  report: ComplianceReport
): Promise<number> => {
  const settings = getJiraSettings();
  if (!isJiraConfigured(settings) || !settings.createIssuesForViolations) {
    return 0;
  }

  let createdCount = 0;

  for (const risk of report.risks) {
    if (settings.createIssuesForHighRiskOnly && risk.severity !== 'high') {
      continue;
    }

    const success = await createJiraIssueForRisk(risk, report.documentName);
    if (success) createdCount++;
  }

  if (createdCount > 0) {
    toast.success(`Created ${createdCount} Jira issues for compliance risks`);
  }

  return createdCount;
};

// Get settings from storage
export const getJiraSettings = (): JiraSettings | null => {
  try {
    const settingsJson = localStorage.getItem('nexabloom_jira_settings');
    return settingsJson ? JSON.parse(settingsJson) : null;
  } catch (error) {
    console.error('[Jira] Error getting settings:', error);
    return null;
  }
};

// Check if a specific setting is enabled
export const isJiraSettingEnabled = (settingName: keyof JiraSettings): boolean => {
  const settings = getJiraSettings();
  return !!(settings && settings.connected && settings[settingName]);
};

// Check if Jira integration is enabled
export const isJiraIntegrationEnabled = (): boolean => {
  const settings = getJiraSettings();
  return !!(settings && settings.connected);
};

// Check if Jira is properly configured
const isJiraConfigured = (settings: JiraSettings | null): boolean => {
  if (!settings || !settings.connected) {
    return false;
  }
  return !!(settings.domain && settings.email && settings.apiToken && settings.projectKey && settings.issueType);
};
