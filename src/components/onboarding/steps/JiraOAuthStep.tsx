
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Loader } from 'lucide-react';
import { useJiraAuth } from '@/hooks/useJiraAuth';
import { toast } from 'sonner';

interface JiraOAuthStepProps {
  onComplete: (data: { jiraConnected: boolean; jiraCloudId: string }) => void;
}

const JiraOAuthStep = ({ onComplete }: JiraOAuthStepProps) => {
  const [cloudId, setCloudId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const { login, isLoading, error } = useJiraAuth();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cloudId || !apiToken) {
      toast.error("Please provide both Cloud ID and API Token");
      return;
    }
    
    try {
      const success = await login(cloudId, apiToken);
      
      if (success) {
        toast.success(`Successfully connected to Jira workspace: ${cloudId}`);
        onComplete({ jiraConnected: true, jiraCloudId: cloudId });
      }
    } catch (err) {
      console.error("Error connecting to Jira:", err);
      toast.error("Failed to connect to Jira. Please check your credentials.");
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <ExternalLink className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <div className="space-y-3">
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
      
      <form onSubmit={handleConnect} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="cloudId">Jira Cloud ID</Label>
          <Input
            id="cloudId"
            placeholder="yourcompany (from yourcompany.atlassian.net)"
            value={cloudId}
            onChange={(e) => setCloudId(e.target.value)}
            required
          />
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
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          type="submit"
          disabled={isLoading || !cloudId || !apiToken} 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect Jira'
          )}
        </Button>
      </form>
    </div>
  );
};

export default JiraOAuthStep;
