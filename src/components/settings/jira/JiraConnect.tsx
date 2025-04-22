
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useJiraIntegration } from '@/hooks/useJiraIntegration';
import { FiExternalLink } from 'react-icons/fi';

const JiraConnect: React.FC = () => {
  const { toast } = useToast();
  const { connect, isLoading } = useJiraIntegration();
  
  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to Jira. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="mb-6 text-center">
        <img 
          src="https://wac-cdn.atlassian.com/dam/jcr:e348b562-4152-4cdc-8a55-3d297e509cc8/Jira%20Software-blue.svg" 
          alt="Jira Logo" 
          className="h-16 mx-auto mb-4" 
        />
        <h3 className="text-xl font-medium mb-2">Connect to Jira</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Integrate with your Jira account to sync issues, projects, and boards with NexaBloom.
        </p>
      </div>
      
      <div className="space-y-4 w-full max-w-md">
        <Button 
          onClick={handleConnect}
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect to Jira'}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          <a 
            href="https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-primary hover:underline"
          >
            Learn more about Jira API
            <FiExternalLink className="ml-1" size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default JiraConnect;
