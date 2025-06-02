
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface JiraOAuthStepProps {
  onComplete: () => void;
}

const JiraOAuthStep: React.FC<JiraOAuthStepProps> = ({ onComplete }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [cloudId, setCloudId] = useState('');
  const [apiToken, setApiToken] = useState('');

  const handleConnect = async () => {
    if (!cloudId || !apiToken) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsConnecting(true);
    
    try {
      // Simulate OAuth connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      toast.success('Successfully connected to Jira!');
      setTimeout(onComplete, 1000);
    } catch (error) {
      toast.error('Failed to connect to Jira');
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected) {
    return (
      <Card className="bg-green-500/20 border-green-500/30">
        <CardContent className="p-6 text-center">
          <Check className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Jira Connected Successfully!
          </h3>
          <p className="text-green-200">
            Your Jira workspace is now linked to StandUpGenie.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-blue-500/20 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-1" />
            <div>
              <h4 className="text-white font-medium">How to get your Jira credentials:</h4>
              <ol className="text-blue-200 text-sm mt-2 space-y-1">
                <li>1. Go to your Jira Cloud instance (yourcompany.atlassian.net)</li>
                <li>2. Click your profile → Account Settings → Security</li>
                <li>3. Create an API token and copy your Cloud ID</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="cloudId" className="text-white">Jira Cloud ID</Label>
          <Input
            id="cloudId"
            value={cloudId}
            onChange={(e) => setCloudId(e.target.value)}
            placeholder="e.g., abc123def-456g-789h-ijk0-lmnopqrstuvw"
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
          />
        </div>
        
        <div>
          <Label htmlFor="apiToken" className="text-white">API Token</Label>
          <Input
            id="apiToken"
            type="password"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            placeholder="Your Jira API token"
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          onClick={handleConnect}
          disabled={isConnecting || !cloudId || !apiToken}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect Jira Cloud
            </>
          )}
        </Button>
        
        <a
          href="https://id.atlassian.com/manage-profile/security/api-tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-300 hover:text-blue-200 text-center"
        >
          Need help getting your API token? →
        </a>
      </div>
    </div>
  );
};

export default JiraOAuthStep;
