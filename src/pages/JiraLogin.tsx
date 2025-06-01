
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Loader } from 'lucide-react';
import { useJiraAuth } from '@/hooks/useJiraAuth';
import { toast } from 'sonner';

const JiraLogin = () => {
  const [cloudId, setCloudId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const { login, isLoading, error } = useJiraAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cloudId || !apiToken) {
      toast.error("Please provide both Cloud ID and API Token");
      return;
    }
    
    try {
      const success = await login(cloudId, apiToken);
      
      if (success) {
        toast.success(`Successfully connected to Jira workspace: ${cloudId}`);
        navigate('/jira');
      }
    } catch (err) {
      console.error("Error connecting to Jira:", err);
      toast.error("Failed to connect to Jira. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connect to Jira</CardTitle>
          <CardDescription>
            Enter your Jira credentials to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <ExternalLink className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <div className="space-y-2">
                <div>
                  <strong>Need an API Token?</strong>
                  <br />
                  <a 
                    href="https://id.atlassian.com/manage-profile/security/api-tokens" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Get it here <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="text-xs text-gray-600">
                  Cloud ID example: If your URL is https://mycompany.atlassian.net, enter "mycompany"
                </div>
              </div>
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full"
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
          </form>
          
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="text-sm"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JiraLogin;
