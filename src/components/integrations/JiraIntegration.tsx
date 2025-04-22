
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useJiraIntegration } from '@/hooks/useJiraIntegration';
import JiraConnect from '@/components/settings/jira/JiraConnect';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import JiraAnalysis from '@/components/settings/jira/JiraAnalysis';
import ProjectSettings from '@/components/settings/jira/ProjectSettings';

interface JiraIntegrationProps {
  compact?: boolean;
}

const JiraIntegration: React.FC<JiraIntegrationProps> = ({ compact = false }) => {
  const { isConnected, disconnect } = useJiraIntegration();
  const [selectedProject, setSelectedProject] = useState<string>();
  const [selectedIssueType, setSelectedIssueType] = useState<string>();
  
  if (!isConnected) {
    return (
      <Card className={compact ? 'w-full' : 'w-full max-w-3xl mx-auto'}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <img 
              src="https://wac-cdn.atlassian.com/dam/jcr:e348b562-4152-4cdc-8a55-3d297e509cc8/Jira%20Software-blue.svg" 
              alt="Jira Logo" 
              className="h-6 mr-2" 
            />
            Jira Integration
          </CardTitle>
          <CardDescription>
            Connect your Atlassian Jira account to sync issues, projects, and boards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JiraConnect />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {!compact && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="https://wac-cdn.atlassian.com/dam/jcr:e348b562-4152-4cdc-8a55-3d297e509cc8/Jira%20Software-blue.svg" 
              alt="Jira Logo" 
              className="h-8 mr-2" 
            />
            <div>
              <h2 className="text-xl font-semibold">Jira Integration</h2>
              <p className="text-sm text-muted-foreground">
                {localStorage.getItem('jira_instance_url') || 'https://yourcompany.atlassian.net'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open('https://your-jira-instance.atlassian.net', '_blank')}>
              Open Jira <ExternalLink className="h-4 w-4 ml-1" />
            </Button>
            <Button variant="outline" onClick={disconnect}>Disconnect</Button>
          </div>
        </div>
      )}
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProjectSettings 
            projectKey={selectedProject}
            issueType={selectedIssueType}
            onProjectChange={setSelectedProject}
            onIssueTypeChange={setSelectedIssueType}
          />
        </div>
        <div className="lg:col-span-2">
          <JiraAnalysis />
        </div>
      </div>
    </div>
  );
};

export default JiraIntegration;
