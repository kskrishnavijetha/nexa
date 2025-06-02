
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface JiraActivity {
  userId: string;
  userEmail: string;
  userName: string;
  activities: {
    statusChanges: Array<{
      issueKey: string;
      summary: string;
      fromStatus: string;
      toStatus: string;
      timestamp: string;
    }>;
    comments: Array<{
      issueKey: string;
      summary: string;
      comment: string;
      timestamp: string;
    }>;
    commits: Array<{
      repository: string;
      message: string;
      timestamp: string;
      issueKeys: string[];
    }>;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, timeframe = '24h' } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log(`Generating standup for user ${userId} for last ${timeframe}`);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch Jira activity for the user (mock data for now)
    const jiraActivity = await fetchJiraActivity(userId, timeframe);
    
    // Generate AI summary using OpenAI
    const aiSummary = await generateAISummary(jiraActivity);
    
    // Store the summary in Supabase
    const { data: standupData, error: insertError } = await supabase
      .from('standup_summaries')
      .insert({
        user_id: userId,
        user_email: jiraActivity.userEmail,
        user_name: jiraActivity.userName,
        summary: aiSummary,
        jira_activity: jiraActivity.activities,
        generated_at: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing standup:', insertError);
      throw new Error('Failed to store standup summary');
    }

    console.log('Standup generated and stored successfully');

    return new Response(JSON.stringify({
      success: true,
      summary: aiSummary,
      standupId: standupData.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-standup function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate standup' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchJiraActivity(userId: string, timeframe: string): Promise<JiraActivity> {
  // Mock Jira API call - in production, this would call the actual Jira API
  console.log(`Fetching Jira activity for user ${userId} for last ${timeframe}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data - replace with actual Jira API calls
  return {
    userId,
    userEmail: 'user@company.com',
    userName: 'John Doe',
    activities: {
      statusChanges: [
        {
          issueKey: 'PROJ-123',
          summary: 'Implement user authentication',
          fromStatus: 'In Progress',
          toStatus: 'Done',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        },
        {
          issueKey: 'PROJ-124',
          summary: 'Fix login bug',
          fromStatus: 'To Do',
          toStatus: 'In Progress',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        },
      ],
      comments: [
        {
          issueKey: 'PROJ-125',
          summary: 'Database optimization',
          comment: 'Updated the query to improve performance by 40%',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        },
      ],
      commits: [
        {
          repository: 'frontend-app',
          message: 'feat: add user authentication flow for PROJ-123',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          issueKeys: ['PROJ-123'],
        },
        {
          repository: 'backend-api',
          message: 'fix: resolve login endpoint bug for PROJ-124',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          issueKeys: ['PROJ-124'],
        },
      ],
    },
  };
}

async function generateAISummary(jiraActivity: JiraActivity): Promise<string> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `Generate a stand-up summary for this user. Format as: Yesterday, Today, Blockers.

User: ${jiraActivity.userName}

Recent Jira Activity:
Status Changes:
${jiraActivity.activities.statusChanges.map(sc => 
  `- ${sc.issueKey}: ${sc.summary} (${sc.fromStatus} → ${sc.toStatus})`
).join('\n')}

Comments:
${jiraActivity.activities.comments.map(c => 
  `- ${c.issueKey}: ${c.comment}`
).join('\n')}

Code Commits:
${jiraActivity.activities.commits.map(cm => 
  `- ${cm.repository}: ${cm.message}`
).join('\n')}

Please generate a concise stand-up summary with:
1. Yesterday: What was completed
2. Today: What is planned/in progress
3. Blockers: Any impediments or issues

Keep it professional and concise.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a stand-up assistant. Generate clear, concise stand-up summaries based on Jira activity data.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    console.error('OpenAI API error:', await response.text());
    throw new Error('Failed to generate AI summary');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
