
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Loader, CheckCircle, Slack } from 'lucide-react';
import { toast } from 'sonner';

interface SlackOAuthStepProps {
  onComplete: (data: { slackConnected: boolean }) => void;
}

const SlackOAuthStep = ({ onComplete }: SlackOAuthStepProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleSlackConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store mock Slack connection
      localStorage.setItem('slack_connected', 'true');
      localStorage.setItem('slack_workspace', 'Demo Workspace');
      
      setIsConnected(true);
      toast.success('Slack workspace connected successfully!');
      
      setTimeout(() => {
        onComplete({ slackConnected: true });
      }, 1000);
    } catch (error) {
      console.error('Slack connection error:', error);
      toast.error('Failed to connect to Slack');
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Slack Connected!</h3>
        <p className="text-gray-600 mb-6">Your Slack workspace is successfully connected.</p>
        <Button 
          onClick={() => onComplete({ slackConnected: true })}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Continue to Team Setup
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Slack className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div>
              <strong>Connect your Slack workspace to:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Automatically post daily stand-ups</li>
                <li>Send notifications to team channels</li>
                <li>Enable team collaboration features</li>
              </ul>
            </div>
          </div>
        </AlertDescription>
      </Alert>
      
      <div className="text-center">
        <Button 
          onClick={handleSlackConnect}
          disabled={isConnecting}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isConnecting ? (
            <>
              <Loader className="h-5 w-5 mr-2 animate-spin" />
              Connecting to Slack...
            </>
          ) : (
            <>
              <Slack className="h-5 w-5 mr-2" />
              Connect Slack Workspace
            </>
          )}
        </Button>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">
          You'll be redirected to Slack to authorize the connection
        </p>
      </div>
    </div>
  );
};

export default SlackOAuthStep;
