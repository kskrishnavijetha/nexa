
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Check, AlertCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface SlackOAuthStepProps {
  onComplete: () => void;
}

const SlackOAuthStep: React.FC<SlackOAuthStepProps> = ({ onComplete }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('#standup');

  const handleConnect = async () => {
    if (!workspaceName) {
      toast.error('Please enter your workspace name');
      return;
    }

    setIsConnecting(true);
    
    try {
      // Simulate OAuth connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      toast.success('Successfully connected to Slack!');
      setTimeout(onComplete, 1000);
    } catch (error) {
      toast.error('Failed to connect to Slack');
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
            Slack Connected Successfully!
          </h3>
          <p className="text-green-200">
            Stand-up summaries will be posted to <span className="font-mono">{selectedChannel}</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-green-500/20 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-green-400 mt-1" />
            <div>
              <h4 className="text-white font-medium">Slack Integration</h4>
              <p className="text-green-200 text-sm mt-1">
                Connect your Slack workspace to automatically post AI-generated stand-up summaries.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="workspace" className="text-white">Workspace Name</Label>
          <Input
            id="workspace"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="e.g., mycompany"
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
          />
          <p className="text-xs text-slate-400 mt-1">
            This is the name in your Slack URL: mycompany.slack.com
          </p>
        </div>
        
        <div>
          <Label htmlFor="channel" className="text-white">Default Channel</Label>
          <Input
            id="channel"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            placeholder="#standup"
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
          />
          <p className="text-xs text-slate-400 mt-1">
            Channel where stand-up summaries will be posted
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          onClick={handleConnect}
          disabled={isConnecting || !workspaceName}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4 mr-2" />
              Connect Slack Workspace
            </>
          )}
        </Button>
        
        <p className="text-xs text-slate-400 text-center">
          You'll be redirected to Slack to authorize the app
        </p>
      </div>
    </div>
  );
};

export default SlackOAuthStep;
