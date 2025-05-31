
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
    
    // Fetch activity data from both services
    const [jiraActivity, githubActivity] = await Promise.all([
      jiraActivityService.getDailyActivity(jiraToken, userEmail),
      githubToken ? githubActivityService.getDailyActivity(githubToken, userEmail || 'user') : null
    ]);
    
    const standupData: StandupData = {
      jiraActivity,
      githubActivity,
      userPreferences: preferences || {
        includeBlockers: true,
        includeMetrics: false,
        tone: 'professional'
      }
    };
    
    // For now, generate a structured standup without OpenAI
    // In a real implementation, you'd call OpenAI API here
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

const generateYesterdaySection = (data: StandupData): string => {
  const { jiraActivity, githubActivity } = data;
  const items = [];
  
  // Add completed Jira issues
  if (jiraActivity.completedIssues.length > 0) {
    items.push(`✅ Completed ${jiraActivity.completedIssues.length} issue(s): ${jiraActivity.completedIssues.join(', ')}`);
  }
  
  // Add work in progress
  if (jiraActivity.inProgressIssues.length > 0) {
    items.push(`🔄 Worked on ${jiraActivity.inProgressIssues.length} issue(s): ${jiraActivity.inProgressIssues.join(', ')}`);
  }
  
  // Add GitHub commits
  if (githubActivity?.totalCommits > 0) {
    items.push(`💻 Made ${githubActivity.totalCommits} commit(s)`);
    if (githubActivity.commits.length > 0) {
      items.push(`   • ${githubActivity.commits[0].message}`);
    }
  }
  
  // Add merged PRs
  if (githubActivity?.mergedPRs > 0) {
    items.push(`🔀 Merged ${githubActivity.mergedPRs} pull request(s)`);
  }
  
  return items.length > 0 ? items.join('\n') : 'No significant activity recorded for yesterday.';
};

const generateTodaySection = (data: StandupData): string => {
  const { jiraActivity } = data;
  const items = [];
  
  // Plan based on current in-progress items
  if (jiraActivity.inProgressIssues.length > 0) {
    items.push(`🎯 Continue working on: ${jiraActivity.inProgressIssues.join(', ')}`);
  }
  
  // Add sprint information if available
  if (jiraActivity.sprintInfo) {
    items.push(`📋 Focus on ${jiraActivity.sprintInfo.name} sprint goals`);
  }
  
  return items.length > 0 ? items.join('\n') : 'Planning to review backlog and pick up new tasks.';
};

const generateBlockersSection = (data: StandupData): string => {
  // For now, return a generic message
  // In a real implementation, you could analyze issue comments, status transitions, etc.
  return 'No blockers at this time.';
};

export const standupGenerator = {
  generateStandup
};
