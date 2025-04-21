
import { toast } from 'sonner';
import { JiraSettings } from '../types';
import { ComplianceRisk, ComplianceReport } from '@/utils/types';
import { AuditEvent } from '@/components/audit/types';
import { jiraRequest, getJiraApiUrl } from '../api/jiraApiClient';
import { isJiraConfigured } from '../settings/jiraSettingsManager';

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

export const createJiraIssueForRisk = async (
  risk: ComplianceRisk,
  documentName: string,
  settings: JiraSettings
): Promise<boolean> => {
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

export const createJiraIssueForAuditEvent = async (
  event: AuditEvent,
  settings: JiraSettings
): Promise<boolean> => {
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

export const createJiraIssuesForReport = async (
  report: ComplianceReport,
  settings: JiraSettings
): Promise<number> => {
  if (!isJiraConfigured(settings) || !settings.createIssuesForViolations) {
    return 0;
  }

  let createdCount = 0;

  for (const risk of report.risks) {
    if (settings.createIssuesForHighRiskOnly && risk.severity !== 'high') {
      continue;
    }

    const success = await createJiraIssueForRisk(risk, report.documentName, settings);
    if (success) createdCount++;
  }

  if (createdCount > 0) {
    toast.success(`Created ${createdCount} Jira issues for compliance risks`);
  }

  return createdCount;
};
