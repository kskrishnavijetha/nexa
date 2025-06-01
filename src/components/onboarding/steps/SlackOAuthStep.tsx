
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Loader, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface SlackOAuthStepProps {
  onComplete: (data: { slackConnected: boolean; slackTeamId: string }) => void;
}

const SlackOAuthStep = ({ onComplete }: SlackOAuthStepProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleSlackOAuth = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      // In a real implementation, this would redirect to Slack OAuth
      // For now, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful connection
      const mockTeamId = 'T1234567890';
      localStorage.setItem('slack_connected', 'true');
      localStorage.setItem('slack_team_id', mockTeamId);
      
      toast.success('Successfully connected to Slack workspace!');
      onComplete({ slackConnected: true, slackTeamId: mockTeamId });
    } catch (err) {
      setError('Failed to connect to Slack. Please try again.');
      toast.error('Failed to connect to Slack');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-green-50 border-green-200">
        <MessageSquare className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <div className="space-y-3">
            <div>
              <strong>Connect your Slack workspace to:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Automatically post stand-up summaries</li>
                <li>Receive notifications and reminders</li>
                <li>Enable team collaboration features</li>
              </ul>
            </div>
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
              <strong>Note:</strong> You'll need admin permissions in your Slack workspace to complete this setup.
            </div>
          </div>
        </AlertDescription>
      </Alert>
      
      <div className="text-center py-8">
        <MessageSquare className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Connect to Slack</h3>
        <p className="text-gray-600 mb-6">
          Authorize StandUp Genie to access your Slack workspace for automated stand-up posting.
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleSlackOAuth}
          disabled={isConnecting}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          size="lg"
        >
          {isConnecting ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Connecting to Slack...
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4 mr-2" />
              Connect Slack Workspace
            </>
          )}
        </Button>
        
        <p className="text-xs text-gray-500 mt-4">
          By connecting, you agree to allow StandUp Genie to post messages and access user information in your Slack workspace.
        </p>
      </div>
    </div>
  );
};

export default SlackOAuthStep;
