
// New service for fetching daily Jira activity for StandUpGenie
import { jiraAuthService } from './jiraAuthService';

interface JiraIssueActivity {
  key: string;
  summary: string;
  status: string;
  assignee: string | null;
  updated: string;
  changes: JiraChangeItem[];
}

interface JiraChangeItem {
  field: string;
  fromString: string | null;
  toString: string | null;
  created: string;
  author: string;
}

interface JiraSprintInfo {
  id: number;
  name: string;
  state: string;
  startDate: string | null;
  endDate: string | null;
  completeDate: string | null;
}

interface JiraDailyActivity {
  issueUpdates: JiraIssueActivity[];
  sprintInfo: JiraSprintInfo | null;
  totalIssuesUpdated: number;
  totalCommentsAdded: number;
  completedIssues: string[];
  inProgressIssues: string[];
}

const getDailyActivity = async (token: string, userEmail?: string): Promise<JiraDailyActivity> => {
  try {
    const cloudId = jiraAuthService.getCloudIdFromToken(token);
    const headers = jiraAuthService.getAuthHeaders(token);
    const baseUrl = `https://${cloudId}.atlassian.net/rest/api/3`;
    
    // Get date range for last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    console.log('Fetching Jira activity for date:', yesterdayStr);
    
    // Build JQL query for issues updated in the last 24 hours
    let jql = `updated >= "${yesterdayStr}"`;
    if (userEmail) {
      jql += ` AND assignee = "${userEmail}"`;
    }
    jql += ' ORDER BY updated DESC';
    
    // Fetch issues with their changes
    const issuesResponse = await fetch(`${baseUrl}/search?jql=${encodeURIComponent(jql)}&expand=changelog&maxResults=50`, {
      headers
    });
    
    if (!issuesResponse.ok) {
      throw new Error(`Failed to fetch issues: ${issuesResponse.status}`);
    }
    
    const issuesData = await issuesResponse.json();
    console.log(`Found ${issuesData.total} updated issues`);
    
    // Process issues and their changes
    const issueUpdates: JiraIssueActivity[] = issuesData.issues.map((issue: any) => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName || null,
      updated: issue.fields.updated,
      changes: issue.changelog?.histories?.flatMap((history: any) => 
        history.items.map((item: any) => ({
          field: item.field,
          fromString: item.fromString,
          toString: item.toString,
          created: history.created,
          author: history.author.displayName
        }))
      ) || []
    }));
    
    // Get current sprint information (simplified - would need project key for real implementation)
    let sprintInfo: JiraSprintInfo | null = null;
    try {
      // This is a simplified sprint fetch - in real implementation, you'd need to know the board ID
      const boardsResponse = await fetch(`${baseUrl}/agile/1.0/board?maxResults=1`, { headers });
      if (boardsResponse.ok) {
        const boardsData = await boardsResponse.json();
        if (boardsData.values.length > 0) {
          const boardId = boardsData.values[0].id;
          const sprintResponse = await fetch(`${baseUrl}/agile/1.0/board/${boardId}/sprint?state=active`, { headers });
          if (sprintResponse.ok) {
            const sprintData = await sprintResponse.json();
            if (sprintData.values.length > 0) {
              const sprint = sprintData.values[0];
              sprintInfo = {
                id: sprint.id,
                name: sprint.name,
                state: sprint.state,
                startDate: sprint.startDate,
                endDate: sprint.endDate,
                completeDate: sprint.completeDate
              };
            }
          }
        }
      }
    } catch (error) {
      console.warn('Could not fetch sprint info:', error);
    }
    
    // Calculate metrics
    const completedIssues = issueUpdates
      .filter(issue => issue.changes.some(change => 
        change.field === 'status' && 
        (change.toString?.toLowerCase().includes('done') || change.toString?.toLowerCase().includes('completed'))
      ))
      .map(issue => issue.key);
    
    const inProgressIssues = issueUpdates
      .filter(issue => issue.changes.some(change => 
        change.field === 'status' && 
        change.toString?.toLowerCase().includes('progress')
      ))
      .map(issue => issue.key);
    
    const totalCommentsAdded = issueUpdates.reduce((count, issue) => 
      count + issue.changes.filter(change => change.field === 'comment').length, 0
    );
    
    return {
      issueUpdates,
      sprintInfo,
      totalIssuesUpdated: issueUpdates.length,
      totalCommentsAdded,
      completedIssues,
      inProgressIssues
    };
    
  } catch (error) {
    console.error('Error fetching Jira daily activity:', error);
    throw new Error(`Failed to fetch Jira activity: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const jiraActivityService = {
  getDailyActivity
};
