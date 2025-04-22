
import { JiraIssue } from '../types';

/**
 * Get all issues from Jira
 */
const getAllIssues = async (): Promise<JiraIssue[]> => {
  try {
    const response = await fetch('/api/jira/issues');
    if (!response.ok) {
      throw new Error('Failed to fetch issues');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw new Error('Failed to fetch issues');
  }
};

/**
 * Get an issue by its key
 */
const getIssueByKey = async (issueKey: string): Promise<JiraIssue | null> => {
  try {
    const response = await fetch(`/api/jira/issues/${issueKey}`);
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching issue ${issueKey}:`, error);
    throw new Error('Failed to fetch issue');
  }
};

export const issueService = {
  getAllIssues,
  getIssueByKey,
};
