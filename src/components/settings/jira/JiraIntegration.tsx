
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import JiraConnect from './JiraConnect';
import JiraProjects from './JiraProjects';
import JiraIssues from './JiraIssues';
import JiraComplianceDashboard from './JiraComplianceDashboard';
import JiraSettings from './JiraSettings';
import JiraReports from './JiraReports';
import { useJiraAuth } from '@/hooks/useJiraAuth';

const JiraIntegration = () => {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, cloudId } = useJiraAuth();

  // Show authentication screen if not connected
  if (!isAuthenticated && !isLoading) {
    return <JiraConnect />;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Verifying Jira connection...</p>
        </div>
      </div>
    );
  }

  // If we get here, we should be authenticated
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Jira Integration</h2>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-muted-foreground">
              Connected to workspace:
            </p>
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800">
              {cloudId || 'Unknown'}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4 mt-4">
          <JiraComplianceDashboard />
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4 mt-4">
          <JiraProjects />
        </TabsContent>
        
        <TabsContent value="issues" className="space-y-4 mt-4">
          <JiraIssues />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4 mt-4">
          <JiraReports />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 mt-4">
          <JiraSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JiraIntegration;
