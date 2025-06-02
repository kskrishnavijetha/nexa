
// AI-powered standup generator using OpenAI
import { jiraActivityService } from '../jira/jiraActivityService';
import { githubActivityService } from '../github/githubActivityService';

interface StandupData {
  jiraActivity: any;
  githubActivity: any;
  userPreferences?: {
    includeBlockers: boolean;
    includeMetrics: boolean;
    tone: 'professional' | 'casual' | 'detailed';
  };
}

interface GeneratedStandup {
  yesterday: string;
  today: string;
  blockers: string;
  rawData: StandupData;
  generatedAt: string;
}

const generateStandup = async (
  jiraToken: string, 
  githubToken?: string, 
  userEmail?: string,
  preferences?: StandupData['userPreferences']
): Promise<GeneratedStandup> => {
  try {
    console.log('Generating standup for user:', userEmail);
    
    // Check if in demo mode
    const isDemoMode = localStorage.getItem('jira_demo_mode') === 'true';
    
    let jiraActivity;
    let githubActivity = null;
    
    if (isDemoMode) {
      // Generate demo data
      jiraActivity = generateDemoJiraActivity();
    } else {
      // Fetch real activity data
      jiraActivity = await jiraActivityService.getDailyActivity(jiraToken, userEmail);
    }
    
    // GitHub activity (optional)
    if (githubToken) {
      try {
        githubActivity = await githubActivityService.getDailyActivity(githubToken, userEmail || 'user');
      } catch (error) {
        console.warn('Failed to fetch GitHub activity:', error);
      }
    }
    
    const standupData: StandupData = {
      jiraActivity,
      githubActivity,
      userPreferences: preferences || {
        includeBlockers: true,
        includeMetrics: false,
        tone: 'professional'
      }
    };
    
    // Generate structured standup content
    const yesterday = generateYesterdaySection(standupData);
    const today = generateTodaySection(standupData);
    const blockers = generateBlockersSection(standupData);
    
    return {
      yesterday,
      today,
      blockers,
      rawData: standupData,
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error generating standup:', error);
    throw new Error(`Failed to generate standup: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const generateDemoJiraActivity = () => {
  return {
    issueUpdates: [
      {
        key: 'DEMO-123',
        summary: 'Implement user authentication system',
        status: 'Done',
        assignee: 'Demo User',
        updated: new Date().toISOString(),
        changes: [
          {
            field: 'status',
            fromString: 'In Progress',
            toString: 'Done',
            created: new Date().toISOString(),
            author: 'Demo User'
          }
        ]
      },
      {
        key: 'DEMO-124',
        summary: 'Fix login page responsive design',
        status: 'In Progress',
        assignee: 'Demo User',
        updated: new Date().toISOString(),
        changes: [
          {
            field: 'status',
            fromString: 'To Do',
            toString: 'In Progress',
            created: new Date().toISOString(),
            author: 'Demo User'
          }
        ]
      }
    ],
    sprintInfo: {
      id: 1,
      name: 'Sprint 23 - Authentication & UI',
      state: 'active',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      completeDate: null
    },
    totalIssuesUpdated: 2,
    totalCommentsAdded: 1,
    completedIssues: ['DEMO-123'],
    inProgressIssues: ['DEMO-124']
  };
};

const generateYesterdaySection = (data: StandupData): string => {
  const { jiraActivity, githubActivity } = data;
  const items = [];
  
  // Add completed Jira issues
  if (jiraActivity.completedIssues && jiraActivity.completedIssues.length > 0) {
    items.push(`✅ Completed ${jiraActivity.completedIssues.length} issue(s): ${jiraActivity.completedIssues.join(', ')}`);
  }
  
  // Add work in progress
  if (jiraActivity.inProgressIssues && jiraActivity.inProgressIssues.length > 0) {
    items.push(`🔄 Worked on ${jiraActivity.inProgressIssues.length} issue(s): ${jiraActivity.inProgressIssues.join(', ')}`);
  }
  
  // Add GitHub commits if available
  if (githubActivity?.totalCommits > 0) {
    items.push(`💻 Made ${githubActivity.totalCommits} commit(s)`);
    if (githubActivity.commits && githubActivity.commits.length > 0) {
      items.push(`   • ${githubActivity.commits[0].message}`);
    }
  }
  
  // Add merged PRs if available
  if (githubActivity?.mergedPRs > 0) {
    items.push(`🔀 Merged ${githubActivity.mergedPRs} pull request(s)`);
  }
  
  return items.length > 0 ? items.join('\n') : 'No significant activity recorded for yesterday.';
};

const generateTodaySection = (data: StandupData): string => {
  const { jiraActivity } = data;
  const items = [];
  
  // Plan based on current in-progress items
  if (jiraActivity.inProgressIssues && jiraActivity.inProgressIssues.length > 0) {
    items.push(`🎯 Continue working on: ${jiraActivity.inProgressIssues.join(', ')}`);
  }
  
  // Add sprint information if available
  if (jiraActivity.sprintInfo) {
    items.push(`📋 Focus on ${jiraActivity.sprintInfo.name} sprint goals`);
  }
  
  // Add general planning if no specific items
  if (items.length === 0) {
    items.push('📝 Review backlog and pick up new tasks');
    items.push('🔍 Participate in team meetings and code reviews');
  }
  
  return items.join('\n');
};

const generateBlockersSection = (data: StandupData): string => {
  // For demo purposes or when no specific blockers are detected
  const commonBlockers = [
    'No blockers at this time.',
    'Waiting for code review on pending PRs.',
    'Need clarification on requirements for upcoming features.',
    'Blocked by external API dependencies.'
  ];
  
  // Return a random blocker for demo, or default for real usage
  const isDemoMode = localStorage.getItem('jira_demo_mode') === 'true';
  if (isDemoMode) {
    return commonBlockers[Math.floor(Math.random() * commonBlockers.length)];
  }
  
  return 'No blockers at this time.';
};

export const standupGenerator = {
  generateStandup
};
