
// GitHub activity service for StandUpGenie
interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

interface GitHubPullRequest {
  number: number;
  title: string;
  state: string;
  author: string;
  createdAt: string;
  mergedAt: string | null;
  url: string;
}

interface GitHubDailyActivity {
  commits: GitHubCommit[];
  pullRequests: GitHubPullRequest[];
  totalCommits: number;
  totalPRs: number;
  mergedPRs: number;
}

const getDailyActivity = async (token: string, username: string, repos: string[] = []): Promise<GitHubDailyActivity> => {
  try {
    // Get date range for last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString();
    
    console.log('Fetching GitHub activity since:', yesterdayStr);
    
    const headers = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    };
    
    // For now, we'll simulate GitHub data since we don't have OAuth set up
    // In a real implementation, you'd fetch from GitHub API
    const mockCommits: GitHubCommit[] = [
      {
        sha: '1a2b3c4',
        message: 'Fix: Jira connection authentication issues',
        author: username,
        date: new Date().toISOString(),
        url: 'https://github.com/user/repo/commit/1a2b3c4'
      },
      {
        sha: '5d6e7f8',
        message: 'Feature: Add StandUpGenie activity fetcher',
        author: username,
        date: new Date().toISOString(),
        url: 'https://github.com/user/repo/commit/5d6e7f8'
      }
    ];
    
    const mockPRs: GitHubPullRequest[] = [
      {
        number: 42,
        title: 'Implement Jira authentication improvements',
        state: 'merged',
        author: username,
        createdAt: yesterdayStr,
        mergedAt: new Date().toISOString(),
        url: 'https://github.com/user/repo/pull/42'
      }
    ];
    
    return {
      commits: mockCommits,
      pullRequests: mockPRs,
      totalCommits: mockCommits.length,
      totalPRs: mockPRs.length,
      mergedPRs: mockPRs.filter(pr => pr.state === 'merged').length
    };
    
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    throw new Error(`Failed to fetch GitHub activity: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const githubActivityService = {
  getDailyActivity
};
