
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JiraConnect from './jira/JiraConnect';
import JiraProjects from './jira/JiraProjects';
import JiraIssueTypes from './jira/JiraIssueTypes';
import JiraAnalysis from './jira/JiraAnalysis';
import { useJiraIntegration } from '@/hooks/useJiraIntegration';

const JiraSettings: React.FC = () => {
  const { isConnected } = useJiraIntegration();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Jira Integration</CardTitle>
        <CardDescription>
          Connect and configure your Atlassian Jira account to sync issues, projects, and boards.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <JiraConnect />
        ) : (
          <Tabs defaultValue="projects">
            <TabsList className="mb-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="issues">Issue Types</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects">
              <JiraProjects />
            </TabsContent>
            
            <TabsContent value="issues">
              <JiraIssueTypes />
            </TabsContent>
            
            <TabsContent value="analysis">
              <JiraAnalysis />
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Webhook Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure webhooks to keep NexaBloom and Jira in sync.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default JiraSettings;
