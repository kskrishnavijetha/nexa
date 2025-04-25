import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudIcon, SlackIcon, ZapIcon, LinkIcon } from "lucide-react";
import WebhookIntegrations from '@/components/integrations/WebhookIntegrations';

const Integrations = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNavigateToIntegration = (path: string, serviceType: string) => {
    switch (serviceType) {
      case 'google':
        const googleClientId = "YOUR_GOOGLE_CLIENT_ID"; // This should come from environment variables
        const googleRedirectUri = encodeURIComponent(window.location.origin + '/google-callback');
        const googleScopes = encodeURIComponent('https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/gmail.readonly');
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&response_type=code&redirect_uri=${googleRedirectUri}&scope=${googleScopes}`;
        window.location.href = googleAuthUrl;
        break;

      case 'slack':
        const slackClientId = "YOUR_SLACK_CLIENT_ID"; // This should come from environment variables
        const slackRedirectUri = encodeURIComponent(window.location.origin + '/slack-callback');
        const slackScopes = 'channels:read,chat:read,files:read';
        const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${slackClientId}&scope=${slackScopes}&redirect_uri=${slackRedirectUri}`;
        window.location.href = slackAuthUrl;
        break;

      case 'jira':
        const jiraClientId = "YOUR_JIRA_CLIENT_ID"; // This should come from environment variables
        const jiraRedirectUri = encodeURIComponent(window.location.origin + '/jira-callback');
        const jiraAuthUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${jiraClientId}&scope=read%3Ajira-work%20read%3Ajira-user&redirect_uri=${jiraRedirectUri}&response_type=code&prompt=consent`;
        window.location.href = jiraAuthUrl;
        break;

      case 'zoom':
        const zoomClientId = "YOUR_ZOOM_CLIENT_ID"; // This should come from environment variables
        const zoomRedirectUri = encodeURIComponent(window.location.origin + '/zoom-callback');
        const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${zoomClientId}&redirect_uri=${zoomRedirectUri}`;
        window.location.href = zoomAuthUrl;
        break;

      case 'microsoft':
        const msClientId = "YOUR_MICROSOFT_CLIENT_ID"; // This should come from environment variables
        const msRedirectUri = encodeURIComponent(window.location.origin + '/microsoft-callback');
        const msScopes = encodeURIComponent('User.Read Files.Read.All Mail.Read Chat.Read');
        const msAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${msClientId}&response_type=code&redirect_uri=${msRedirectUri}&scope=${msScopes}&response_mode=query`;
        window.location.href = msAuthUrl;
        break;

      default:
        navigate(path);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Connect NexaBloom with your existing tools and workflows
          </p>
        </div>

        <Tabs 
          defaultValue="available" 
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full md:w-auto grid-cols-3 gap-2">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <IntegrationCard 
                title="Google Services" 
                description="Scan Google Drive, Gmail, and Google Docs for compliance violations"
                icon={<CloudIcon className="h-5 w-5" />}
                onClick={() => handleNavigateToIntegration('/google-services', 'google')}
                isConnected={true}
              />
              
              <IntegrationCard 
                title="Slack" 
                description="Monitor Slack conversations and file sharing for compliance risks"
                icon={<SlackIcon className="h-5 w-5" />}
                onClick={() => handleNavigateToIntegration('/slack-monitoring', 'slack')}
                isConnected={true}
              />
              
              <IntegrationCard 
                title="Jira" 
                description="Create and track compliance-related issues in your Jira workspace"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.775a5.218 5.218 0 0 0 5.232 5.214h2.129v2.058a5.215 5.215 0 0 0 5.215 5.214V6.762a1.005 1.005 0 0 0-1.057-1.005zM23.013 0H11.494a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.005 1.005 0 0 0 23.013 0z" />
                </svg>}
                onClick={() => handleNavigateToIntegration('/jira', 'jira')}
                isConnected={true}
              />
              
              <IntegrationCard 
                title="Zoom" 
                description="Scan Zoom meetings, recordings and transcripts for compliance issues"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-6.921-5.092L10.5 12l6.579 5.092v-10.184z" />
                </svg>}
                onClick={() => handleNavigateToIntegration('/zoom', 'zoom')}
                isConnected={false}
              />
              
              <IntegrationCard 
                title="Microsoft 365" 
                description="Connect to Microsoft 365 for compliance monitoring of Office documents"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3v18h24v-18h-24zm6.375 7.125h-2.25v1.5h1.875c-.309 1.434-1.582 2.512-3.094 2.512-1.748 0-3.156-1.434-3.156-3.137s1.408-3.137 3.156-3.137c.84 0 1.641.328 2.25.93l1.059-1.059c-.84-.84-1.992-1.312-3.309-1.312-2.527 0-4.594 2.066-4.594 4.594s2.066 4.594 4.594 4.594c2.52 0 4.594-2.059 4.594-4.594v-.891zm10.5 5.625h2.25v-8.25h-2.25v8.25zm4.5-9.75h-11.25v11.25h11.25v-11.25zm-2.25 9h-6.75v-6.75h6.75v6.75z" />
                </svg>}
                onClick={() => handleNavigateToIntegration('/microsoft-365', 'microsoft')}
                isConnected={false}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="connected" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <IntegrationCard 
                title="Google Services" 
                description="Connected on Apr 22, 2025"
                icon={<CloudIcon className="h-5 w-5" />}
                onClick={() => handleNavigateToIntegration('/google-services', 'google')}
                isConnected={true}
              />
              
              <IntegrationCard 
                title="Slack" 
                description="Connected on Apr 20, 2025"
                icon={<SlackIcon className="h-5 w-5" />}
                onClick={() => handleNavigateToIntegration('/slack-monitoring', 'slack')}
                isConnected={true}
              />
              
              <IntegrationCard 
                title="Jira" 
                description="Connected on Apr 18, 2025"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.775a5.218 5.218 0 0 0 5.232 5.214h2.129v2.058a5.215 5.215 0 0 0 5.215 5.214V6.762a1.005 1.005 0 0 0-1.057-1.005zM23.013 0H11.494a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.005 1.005 0 0 0 23.013 0z" />
                </svg>}
                onClick={() => handleNavigateToIntegration('/jira', 'jira')}
                isConnected={true}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="webhooks" className="space-y-4">
            <WebhookIntegrations />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  isConnected: boolean;
}

const IntegrationCard = ({ title, description, icon, onClick, isConnected }: IntegrationCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">{icon}</span>
            {title}
          </CardTitle>
          {isConnected && (
            <div className="rounded-full h-2 w-2 bg-green-500"></div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button 
          variant={isConnected ? "outline" : "default"} 
          onClick={onClick} 
          className="w-full"
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          {isConnected ? "Configure" : "Connect"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Integrations;
