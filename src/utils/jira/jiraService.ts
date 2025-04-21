
import { ComplianceRisk, ComplianceReport } from '@/utils/types';
import { AuditEvent } from '@/components/audit/types';
import { toast } from 'sonner';

interface JiraSettings {
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

interface JiraIssueFields {
  summary: string;
  description: string;
  issuetype: {
    id: string;
  };
  project: {
    key: string;
  };
  [key: string]: any;
}

/**
 * Create a Jira issue based on a compliance risk
 */
export const createJiraIssueForRisk = async (
  risk: ComplianceRisk,
  documentName: string
): Promise<boolean> => {
  try {
    const settings = getJiraSettings();
    if (!isJiraConfigured(settings)) {
      return false;
    }
    
    // Check if we should only create issues for high risks
    if (settings.createIssuesForHighRiskOnly && risk.severity !== 'high') {
      console.log(`[Jira] Skipping issue creation for ${risk.severity} risk: ${risk.title}`);
      return false;
    }
    
    // Check if risk issue creation is enabled
    if (!settings.createIssuesForViolations && !settings.createIssuesForRisks) {
      console.log('[Jira] Risk issue creation is disabled in settings');
      return false;
    }

    const issueFields: JiraIssueFields = {
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

    const result = await createJiraIssue(settings, issueFields);
    return result;
  } catch (error) {
    console.error('[Jira] Error creating issue for risk', error);
    return false;
  }
};

/**
 * Create a Jira issue based on an audit event
 */
export const createJiraIssueForAuditEvent = async (
  event: AuditEvent
): Promise<boolean> => {
  try {
    const settings = getJiraSettings();
    if (!isJiraConfigured(settings) || !settings.createIssuesForAuditEntries) {
      return false;
    }
    
    // Only create issues for critical audit events
    // Use string comparison for the status check
    if (event.status !== 'critical') {
      return false;
    }

    const issueFields: JiraIssueFields = {
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

    const result = await createJiraIssue(settings, issueFields);
    return result;
  } catch (error) {
    console.error('[Jira] Error creating issue for audit event', error);
    return false;
  }
};

/**
 * Create a Jira issue based on a compliance report
 */
export const createJiraIssuesForReport = async (
  report: ComplianceReport
): Promise<number> => {
  try {
    const settings = getJiraSettings();
    if (!isJiraConfigured(settings) || !settings.createIssuesForViolations) {
      return 0;
    }

    let createdCount = 0;
    
    // Create a Jira issue for each high-risk violation
    for (const risk of report.risks) {
      if (settings.createIssuesForHighRiskOnly && risk.severity !== 'high') {
        continue;
      }
      
      const issueFields: JiraIssueFields = {
        project: { key: settings.projectKey },
        issuetype: { id: settings.issueType },
        summary: `[${risk.severity.toUpperCase()}] ${risk.title || risk.description.substring(0, 50)} - ${report.documentName}`,
        description: formatJiraDescription({
          description: risk.description,
          documentName: report.documentName,
          framework: risk.regulation || 'Not specified',
          riskLevel: risk.severity,
          remediation: risk.mitigation || 'No specific remediation steps provided'
        })
      };

      const success = await createJiraIssue(settings, issueFields);
      if (success) {
        createdCount++;
      }
    }

    if (createdCount > 0) {
      toast.success(`Created ${createdCount} Jira issues for compliance risks`);
    }
    
    return createdCount;
  } catch (error) {
    console.error('[Jira] Error creating issues for report', error);
    return 0;
  }
};

/**
 * Create a Jira issue with the provided fields
 */
const createJiraIssue = async (
  settings: JiraSettings,
  fields: JiraIssueFields
): Promise<boolean> => {
  try {
    // In a real implementation, this would make an API call to create a Jira issue
    // For this demo, we'll simply log the issue that would be created
    console.log(`[Jira] Creating issue in project ${settings.projectKey}:`);
    console.log(`[Jira] Summary: ${fields.summary}`);
    console.log(`[Jira] Description: ${fields.description.substring(0, 100)}...`);
    
    // Show a toast notification
    toast.success(`Created Jira issue: ${fields.summary}`);
    
    // Simulate success
    return true;
  } catch (error) {
    console.error('[Jira] Error creating issue', error);
    toast.error('Failed to create Jira issue');
    return false;
  }
};

/**
 * Format a description for a Jira issue
 */
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

/**
 * Check if Jira is properly configured
 */
const isJiraConfigured = (settings: JiraSettings | null): boolean => {
  if (!settings || !settings.connected) {
    return false;
  }
  
  return !!(settings.domain && settings.email && settings.apiToken && settings.projectKey && settings.issueType);
};

/**
 * Get Jira settings from local storage
 */
export const getJiraSettings = (): JiraSettings | null => {
  try {
    const settingsJson = localStorage.getItem('nexabloom_jira_settings');
    if (!settingsJson) {
      return null;
    }
    
    return JSON.parse(settingsJson) as JiraSettings;
  } catch (error) {
    console.error('[Jira] Error getting Jira settings', error);
    return null;
  }
};

/**
 * Utility to check whether a specific setting is enabled
 */
export const isJiraSettingEnabled = (settingName: keyof JiraSettings): boolean => {
  const settings = getJiraSettings();
  if (!settings || !settings.connected) {
    return false;
  }
  
  return !!settings[settingName];
};

/**
 * Function to check if Jira integration is enabled
 */
export const isJiraIntegrationEnabled = (): boolean => {
  const settings = getJiraSettings();
  return !!(settings && settings.connected);
};
