
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface JiraActivity {
  issueKey: string;
  summary: string;
  statusChanges: Array<{
    from: string;
    to: string;
    timestamp: string;
  }>;
  comments: Array<{
    body: string;
    author: string;
    timestamp: string;
  }>;
  linkedCommits?: Array<{
    message: string;
    author: string;
    timestamp: string;
  }>;
}

interface StandupSummary {
  userId: string;
  yesterday: string;
  today: string;
  blockers: string;
  generatedAt: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, jiraToken, cloudId } = await req.json();

    if (!userId || !jiraToken || !cloudId) {
      throw new Error("Missing required parameters");
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch last 24h of Jira activity
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const since = yesterday.toISOString().split('T')[0];

    const jiraActivity = await fetchJiraActivity(jiraToken, cloudId, userId, since);
    
    // Generate AI summary using OpenAI
    const summary = await generateAISummary(jiraActivity);
    
    // Store in Supabase
    const { data, error } = await supabase
      .from('standup_summaries')
      .insert([{
        user_id: userId,
        yesterday: summary.yesterday,
        today: summary.today,
        blockers: summary.blockers,
        raw_data: jiraActivity,
        generated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ summary: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating standup:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function fetchJiraActivity(token: string, cloudId: string, userEmail: string, since: string): Promise<JiraActivity[]> {
  const baseUrl = `https://${cloudId}.atlassian.net/rest/api/3`;
  
  // Decode token to get auth header
  const parts = token.split(':');
  const [, email, apiToken] = parts;
  const authHeader = btoa(`${email}:${apiToken}`);
  
  const headers = {
    'Authorization': `Basic ${authHeader}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  // Fetch issues updated since yesterday for this user
  const jql = `assignee = "${userEmail}" AND updated >= "${since}" ORDER BY updated DESC`;
  
  const response = await fetch(`${baseUrl}/search?jql=${encodeURIComponent(jql)}&expand=changelog&maxResults=50`, {
    headers,
    mode: 'cors'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Jira activity: ${response.status}`);
  }

  const data = await response.json();
  
  return data.issues.map((issue: any) => ({
    issueKey: issue.key,
    summary: issue.fields.summary,
    statusChanges: issue.changelog?.histories?.flatMap((history: any) => 
      history.items
        .filter((item: any) => item.field === 'status')
        .map((item: any) => ({
          from: item.fromString || '',
          to: item.toString || '',
          timestamp: history.created
        }))
    ) || [],
    comments: issue.changelog?.histories?.flatMap((history: any) => 
      history.items
        .filter((item: any) => item.field === 'comment')
        .map(() => ({
          body: 'Comment added',
          author: history.author.displayName,
          timestamp: history.created
        }))
    ) || [],
    linkedCommits: [] // TODO: Implement GitHub/GitLab integration
  }));
}

async function generateAISummary(activities: JiraActivity[]): Promise<StandupSummary> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `
Based on the following Jira activity from the last 24 hours, generate a stand-up summary in this exact format:

Yesterday:
[What the user accomplished yesterday]

Today:
[What the user plans to work on today]

Blockers:
[Any blockers or issues the user is facing]

Jira Activity:
${JSON.stringify(activities, null, 2)}

Keep it concise and professional. Focus on completed work, status changes, and any blockers mentioned in comments.
`;

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
          content: 'You are a stand-up assistant. Generate clear, concise stand-up summaries based on Jira activity. Format as: Yesterday, Today, Blockers.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 500
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // Parse the response into sections
  const sections = content.split('\n\n');
  const yesterday = sections.find((s: string) => s.startsWith('Yesterday:'))?.replace('Yesterday:', '').trim() || 'No activity recorded.';
  const today = sections.find((s: string) => s.startsWith('Today:'))?.replace('Today:', '').trim() || 'Planning to continue current work.';
  const blockers = sections.find((s: string) => s.startsWith('Blockers:'))?.replace('Blockers:', '').trim() || 'No blockers.';

  return {
    userId: '',
    yesterday,
    today,
    blockers,
    generatedAt: new Date().toISOString()
  };
}
