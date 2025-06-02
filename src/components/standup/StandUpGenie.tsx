
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJiraAuth } from '@/hooks/useJiraAuth';
import { standupGenerator } from '@/utils/standup/standupGenerator';
import { Loader, Zap, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GeneratedStandup {
  yesterday: string;
  today: string;
  blockers: string;
  generatedAt: string;
}

const StandUpGenie = () => {
  const { isAuthenticated, token, isDemoMode } = useJiraAuth();
  const [standup, setStandup] = useState<GeneratedStandup | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStandup = async () => {
    if (!token) {
      toast.error('Please connect to Jira first');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Generating standup with token:', token);
      
      // Extract user email from token for real connections
      let userEmail = 'user@example.com'; // Default for demo mode
      
      if (!isDemoMode && token.includes(':')) {
        const tokenParts = token.split(':');
        if (tokenParts.length >= 2) {
          userEmail = tokenParts[1]; // Email is the second part
        }
      }
      
      console.log('Using email for standup:', userEmail);
      
      const result = await standupGenerator.generateStandup(token, undefined, userEmail);
      setStandup(result);
      toast.success('Standup generated successfully!');
    } catch (error) {
      console.error('Failed to generate standup:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate standup';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            StandUp Genie
          </CardTitle>
          <CardDescription>
            AI-powered daily standup generator from your Jira and GitHub activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Connect to Jira to start generating daily standups</p>
            <Badge variant="outline">Jira Integration Required</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            StandUp Genie
          </CardTitle>
          <CardDescription>
            Generate your daily standup automatically from Jira activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isDemoMode && (
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Demo mode is active. Generated standups will use sample data.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Calendar className="h-3 w-3 mr-1" />
                Connected {isDemoMode && '(Demo)'}
              </Badge>
            </div>
            <Button 
              onClick={handleGenerateStandup} 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Generate Standup
                </>
              )}
            </Button>
          </div>

          {standup && (
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Daily Standup</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(`Yesterday:\n${standup.yesterday}\n\nToday:\n${standup.today}\n\nBlockers:\n${standup.blockers}`)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </div>

              <div className="grid gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-700">Yesterday</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm">{standup.yesterday}</pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-blue-700">Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm">{standup.today}</pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-orange-700">Blockers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm">{standup.blockers}</pre>
                  </CardContent>
                </Card>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Generated at {new Date(standup.generatedAt).toLocaleString()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StandUpGenie;
