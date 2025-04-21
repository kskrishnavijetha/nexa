
import { JiraSettings } from '../types';
import { ComplianceRisk, ComplianceReport } from '@/utils/types';
import { AuditEvent } from '@/components/audit/types';
import { jiraRequest, getJiraApiUrl } from '../api/jiraApiClient';
import { isDemoMode, createDemoIssueForRisk, createDemoIssueForAuditEvent, createDemoIssuesForReport } from '../demo/demoJiraService';

export const createJiraIssueForRisk = async (
  risk: ComplianceRisk,
  documentName: string,
  settings: JiraSettings
): Promise<boolean> => {
  if (isDemoMode(settings)) {
    return await createDemoIssueForRisk(risk, documentName);
  }

  try {
    const url = `${getJiraApiUrl(settings.domain)}/issue`;
    await jiraRequest(url, settings, {
      method: 'POST',
      body: JSON.stringify({
        fields: {
          project: { key: settings.projectKey },
          issuetype: { id: settings.issueType },
          summary: `Risk: ${risk.title}`,
          description: `Document: ${documentName}\n\nDescription: ${risk.description}\nSeverity: ${risk.severity}\nRegulation: ${risk.regulation}\nMitigation: ${risk.mitigation}`
        }
      })
    });
    return true;
  } catch (error) {
    console.error('[Jira] Error creating issue for risk:', error);
    return false;
  }
};

export const createJiraIssueForAuditEvent = async (
  event: AuditEvent,
  settings: JiraSettings
): Promise<boolean> => {
  if (isDemoMode(settings)) {
    return await createDemoIssueForAuditEvent(event);
  }

  try {
    const url = `${getJiraApiUrl(settings.domain)}/issue`;
    await jiraRequest(url, settings, {
      method: 'POST',
      body: JSON.stringify({
        fields: {
          project: { key: settings.projectKey },
          issuetype: { id: settings.issueType },
          summary: `Audit Event: ${event.action}`,
          description: `Document: ${event.documentName}\n\nAction: ${event.action}\nUser: ${event.user}\nStatus: ${event.status}\nTimestamp: ${event.timestamp}`
        }
      })
    });
    return true;
  } catch (error) {
    console.error('[Jira] Error creating issue for audit event:', error);
    return false;
  }
};

export const createJiraIssuesForReport = async (
  report: ComplianceReport,
  settings: JiraSettings
): Promise<number> => {
  if (isDemoMode(settings)) {
    return await createDemoIssuesForReport(report);
  }

  try {
    let issuesCreated = 0;
    
    for (const risk of report.risks) {
      const success = await createJiraIssueForRisk(risk, report.documentName, settings);
      if (success) issuesCreated++;
    }
    
    return issuesCreated;
  } catch (error) {
    console.error('[Jira] Error creating issues for report:', error);
    return 0;
  }
};
