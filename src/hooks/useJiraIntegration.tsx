
import { useCallback } from 'react';
import { ComplianceRisk, ComplianceReport } from '@/utils/types';
import { AuditEvent } from '@/components/audit/types';
import { 
  createJiraIssueForRisk, 
  createJiraIssueForAuditEvent, 
  createJiraIssuesForReport,
  isJiraIntegrationEnabled,
  isJiraSettingEnabled,
  getJiraSettings
} from '@/utils/jira/jiraService';

export const useJiraIntegration = () => {
  /**
   * Create a Jira issue for a risk
   */
  const createIssueForRisk = useCallback(async (
    risk: ComplianceRisk,
    documentName: string
  ) => {
    // Check if Jira integration is enabled and the specific setting is enabled
    if (!isJiraIntegrationEnabled() || !isJiraSettingEnabled('createIssuesForRisks')) {
      console.log('[Jira] Integration disabled or risk issues disabled');
      return false;
    }
    
    const settings = getJiraSettings();
    if (!settings) return false;
    
    return await createJiraIssueForRisk(risk, documentName, settings);
  }, []);
  
  /**
   * Create a Jira issue for an audit event
   */
  const createIssueForAuditEvent = useCallback(async (
    event: AuditEvent
  ) => {
    // Check if Jira integration is enabled and the specific setting is enabled
    if (!isJiraIntegrationEnabled() || !isJiraSettingEnabled('createIssuesForAuditEntries')) {
      console.log('[Jira] Integration disabled or audit events disabled');
      return false;
    }
    
    const settings = getJiraSettings();
    if (!settings) return false;
    
    return await createJiraIssueForAuditEvent(event, settings);
  }, []);
  
  /**
   * Create Jira issues for all qualifying risks in a report
   */
  const createIssuesForReport = useCallback(async (
    report: ComplianceReport
  ) => {
    // Check if Jira integration is enabled and the specific setting is enabled
    if (!isJiraIntegrationEnabled() || !isJiraSettingEnabled('createIssuesForViolations')) {
      console.log('[Jira] Integration disabled or violation issues disabled');
      return 0;
    }
    
    const settings = getJiraSettings();
    if (!settings) return 0;
    
    return await createJiraIssuesForReport(report, settings);
  }, []);
  
  /**
   * Check if the Jira integration is enabled
   */
  const isEnabled = useCallback(() => {
    return isJiraIntegrationEnabled();
  }, []);
  
  return {
    createIssueForRisk,
    createIssueForAuditEvent,
    createIssuesForReport,
    isEnabled
  };
};
