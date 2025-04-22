
import { ComplianceIssue, JiraFilter } from './types';

/**
 * Get compliance issues from Jira based on filter criteria
 */
const getComplianceIssues = async (filter?: JiraFilter): Promise<ComplianceIssue[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filter) {
      if (filter.projectKeys?.length) {
        queryParams.append('projects', filter.projectKeys.join(','));
      }
      if (filter.statuses?.length) {
        queryParams.append('statuses', filter.statuses.join(','));
      }
      if (filter.priorities?.length) {
        queryParams.append('priorities', filter.priorities.join(','));
      }
      if (filter.searchTerm) {
        queryParams.append('search', filter.searchTerm);
      }
    }
    
    const response = await fetch(`/api/jira/compliance-issues?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch compliance issues');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching compliance issues:', error);
    throw new Error('Failed to fetch compliance issues');
  }
};

/**
 * Update issue with compliance metadata
 */
const updateIssueWithComplianceData = async (issueKey: string, complianceData: Partial<ComplianceIssue>): Promise<boolean> => {
  try {
    const response = await fetch(`/api/jira/issues/${issueKey}/compliance`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complianceData),
    });
    
    return response.ok;
  } catch (error) {
    console.error(`Error updating issue ${issueKey}:`, error);
    return false;
  }
};

export const jiraIssueService = {
  getComplianceIssues,
  updateIssueWithComplianceData,
};

