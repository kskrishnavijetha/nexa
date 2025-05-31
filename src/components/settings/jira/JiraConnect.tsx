
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useJiraAuth } from '@/hooks/useJiraAuth';
import { Loader, ExternalLink, Info } from 'lucide-react';
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
        toast.success(`Successfully connected to Jira workspace: ${cloudId}`);
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
            Link your Jira workspace to enable StandUp Genie and compliance monitoring.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form id="jira-connect-form" onSubmit={handleConnect} className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertTitle>Getting your Jira credentials</AlertTitle>
              <AlertDescription className="text-sm">
                <div className="space-y-3 mt-2">
                  <div>
                    <strong>1. Get your API Token:</strong>
                    <br />
                    <a 
                      href="https://id.atlassian.com/manage-profile/security/api-tokens" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      Visit Atlassian API tokens page <ExternalLink className="h-3 w-3" />
                    </a>
                    <br />
                    <span className="text-xs text-muted-foreground">Create a new token and copy it</span>
                  </div>
                  <div>
                    <strong>2. Find your Cloud ID:</strong>
                    <br />
                    <span className="text-xs text-muted-foreground">
                      From your Jira URL: https://<strong>yourcompany</strong>.atlassian.net<br />
                      Just enter "yourcompany" (without the domain)
                    </span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cloudId">Jira Cloud ID</Label>
                <Input
                  id="cloudId"
                  placeholder="yourcompany (from yourcompany.atlassian.net)"
                  value={cloudId}
                  onChange={(e) => setCloudId(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter only the subdomain part (e.g., "acme" from acme.atlassian.net)
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="apiToken">API Token</Label>
                <Input
                  id="apiToken"
                  type="password"
                  placeholder="Your Atlassian API token"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  API token from your Atlassian account security settings
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
            disabled={isLoading || !cloudId || !apiToken} 
            className="w-full"
            onClick={handleConnect}
            type="button"
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
