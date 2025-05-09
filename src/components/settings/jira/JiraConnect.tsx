
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useJiraAuth } from '@/hooks/useJiraAuth';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

const JiraConnect: React.FC = () => {
  const [cloudId, setCloudId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const { login, isLoading, error } = useJiraAuth();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Connect button clicked");
    
    if (!cloudId || !apiToken) {
      toast.error("Please provide both Cloud ID and API Token");
      return;
    }
    
    try {
      console.log("Attempting to login with:", { cloudId, apiToken: '***' });
      const success = await login(cloudId, apiToken);
      
      if (success) {
        console.log("Jira connection successful");
      }
    } catch (err) {
      console.error("Error connecting to Jira:", err);
      toast.error("Failed to connect to Jira. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center py-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Connect to Jira</CardTitle>
          <CardDescription>
            Link your Jira workspace to enable compliance monitoring and risk assessment.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form id="jira-connect-form" onSubmit={handleConnect} className="space-y-6">
            <Alert className="bg-muted">
              <AlertTitle>Getting your Jira Cloud ID and API Token</AlertTitle>
              <AlertDescription className="text-sm">
                <ol className="list-decimal list-inside space-y-2 mt-2">
                  <li>Go to <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Atlassian API tokens page</a></li>
                  <li>Create an API token and copy it</li>
                  <li>Find your Cloud ID from your Jira URL: yourcompany.atlassian.net</li>
                </ol>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cloudId">Jira Cloud ID</Label>
                <Input
                  id="cloudId"
                  placeholder="yourcompany.atlassian.net"
                  value={cloudId}
                  onChange={(e) => setCloudId(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your Jira domain, e.g. yourcompany.atlassian.net
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="apiToken">API Token</Label>
                <Input
                  id="apiToken"
                  type="password"
                  placeholder="Your Jira API token"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  API token from your Atlassian account
                </p>
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
        
        <CardFooter>
          <Button 
            form="jira-connect-form"
            disabled={isLoading || !cloudId || !apiToken} 
            className="w-full"
            type="submit"
            onClick={handleConnect}
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect to Jira'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JiraConnect;
