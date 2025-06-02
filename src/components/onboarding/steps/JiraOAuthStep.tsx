
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Loader, CheckCircle } from 'lucide-react';
import { useJiraAuth } from '@/hooks/useJiraAuth';
import { toast } from 'sonner';

interface JiraOAuthStepProps {
  onComplete: (data: { jiraConnected: boolean }) => void;
}

const JiraOAuthStep = ({ onComplete }: JiraOAuthStepProps) => {
  const [cloudId, setCloudId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const { login, isLoading, error, isAuthenticated } = useJiraAuth();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cloudId || !apiToken) {
      toast.error("Please provide both Cloud ID and API Token");
      return;
    }
    
    try {
      const success = await login(cloudId, apiToken);
      
      if (success) {
        toast.success('Jira connected successfully!');
        onComplete({ jiraConnected: true });
      }
    } catch (err) {
      console.error("Error connecting to Jira:", err);
      toast.error("Failed to connect to Jira. Please check your credentials.");
    }
  };

  if (isAuthenticated) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Jira Connected!</h3>
        <p className="text-gray-600 mb-6">Your Jira workspace is successfully connected.</p>
        <Button 
          onClick={() => onComplete({ jiraConnected: true })}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Continue to Next Step
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <ExternalLink className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div>
              <strong>Get your API Token:</strong>
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
            <div className="text-sm text-gray-600">
              Cloud ID example: If your URL is https://mycompany.atlassian.net, enter "mycompany"
            </div>
          </div>
        </AlertDescription>
      </Alert>
      
      <form onSubmit={handleConnect} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cloudId">Jira Cloud ID</Label>
          <Input
            id="cloudId"
            placeholder="mycompany"
            value={cloudId}
            onChange={(e) => setCloudId(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="apiToken">API Token</Label>
          <Input
            id="apiToken"
            type="password"
            placeholder="Your API token"
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
            'Connect Jira Workspace'
          )}
        </Button>
      </form>
    </div>
  );
};

export default JiraOAuthStep;
