
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ConnectionSettings from './jira/ConnectionSettings';
import ProjectSettings from './jira/ProjectSettings';
import IssueCreationRules from './jira/IssueCreationRules';
import { useJiraForm } from './jira/useJiraForm';

const JiraIntegration: React.FC = () => {
  const {
    form,
    isLoading,
    isConnected,
    testingConnection,
    projects,
    issueTypes,
    testConnection,
    disconnectJira,
    onSubmit
  } = useJiraForm();

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <CardTitle>Jira Integration</CardTitle>
        </div>
        <CardDescription>
          Configure automatic creation of Jira issues for compliance violations, risks, and audit events
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <ConnectionSettings
              form={form}
              isConnected={isConnected}
              testingConnection={testingConnection}
              testConnection={testConnection}
              disconnectJira={disconnectJira}
            />

            {isConnected && (
              <>
                <Separator />
                <ProjectSettings
                  form={form}
                  isLoading={isLoading}
                  projects={projects}
                  issueTypes={issueTypes}
                />
                <Separator />
                <IssueCreationRules form={form} />
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
            {isConnected && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default JiraIntegration;
