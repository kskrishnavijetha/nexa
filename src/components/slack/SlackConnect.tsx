
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Check, AlertCircle, Slack } from 'lucide-react';
import { getSlackToken, setSlackToken, clearSlackToken, isSlackConnected } from '@/utils/slack/slackService';

const SlackConnect: React.FC = () => {
  const [token, setToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Check if already connected
    setIsConnected(isSlackConnected());
    
    // Pre-fill token if stored
    const storedToken = getSlackToken();
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  
  const handleConnect = async () => {
    if (!token.trim()) {
      toast.error('Please enter a valid Slack API token');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // In a real implementation, we would validate the token with the Slack API
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      const success = setSlackToken(token);
      
      if (success) {
        setIsConnected(true);
        toast.success('Successfully connected to Slack');
      } else {
        toast.error('Failed to connect to Slack. Please check your token.');
      }
    } catch (error) {
      console.error('Slack connection error:', error);
      toast.error('Failed to connect to Slack. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = () => {
    clearSlackToken();
    setToken('');
    setIsConnected(false);
    toast.success('Disconnected from Slack');
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Slack className="h-5 w-5 mr-2" />
          Slack Connection
        </CardTitle>
        <CardDescription>
          Connect to your Slack workspace to monitor messages and file uploads for compliance violations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="slack-token" className="text-sm font-medium">
              Slack API Token
            </label>
            <Input
              id="slack-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="xoxb-your-slack-token"
              disabled={isConnected || isConnecting}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Enter your Slack Bot User OAuth Token. You can create one in the Slack API dashboard.
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            {isConnected ? (
              <div className="flex items-center text-sm text-green-600">
                <Check className="h-4 w-4 mr-1" />
                Connected to Slack
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 mr-1" />
                Not connected
              </div>
            )}
            
            {isConnected ? (
              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="ml-auto"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !token.trim()}
                className="ml-auto"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect to Slack'
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlackConnect;
