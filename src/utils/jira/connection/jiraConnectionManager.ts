
import { JiraSettings, JiraProject, JiraIssueType } from '../types';
import { jiraRequest, getJiraApiUrl } from '../api/jiraApiClient';

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
