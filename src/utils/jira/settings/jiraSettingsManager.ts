
import { JiraSettings } from '../types';

export const getJiraSettings = (): JiraSettings | null => {
  try {
    const settingsJson = localStorage.getItem('nexabloom_jira_settings');
    return settingsJson ? JSON.parse(settingsJson) : null;
  } catch (error) {
    console.error('[Jira] Error getting settings:', error);
    return null;
  }
};

export const isJiraSettingEnabled = (settingName: keyof JiraSettings): boolean => {
  const settings = getJiraSettings();
  return !!(settings && settings.connected && settings[settingName]);
};

export const isJiraIntegrationEnabled = (): boolean => {
  const settings = getJiraSettings();
  return !!(settings && settings.connected);
};

export const isJiraConfigured = (settings: JiraSettings | null): boolean => {
  if (!settings || !settings.connected) {
    return false;
  }
  return !!(
    settings.domain && 
    settings.email && 
    settings.apiToken && 
    settings.projectKey && 
    settings.issueType
  );
};
