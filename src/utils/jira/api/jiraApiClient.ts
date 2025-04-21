
import { JiraSettings, JiraApiResponse, JiraRequestOptions } from '../types';

// Base API URL builder
const getJiraApiUrl = (domain: string) => `https://${domain}/rest/api/2`;

// API request helper with auth
export const jiraRequest = async (
  url: string,
  settings: JiraSettings,
  options: JiraRequestOptions = {}
): Promise<JiraApiResponse> => {
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

export { getJiraApiUrl };
