
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseJiraIntegrationReturn {
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export function useJiraIntegration(): UseJiraIntegrationReturn {
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    // Check if there's a stored Jira token
    return localStorage.getItem('jira_access_token') !== null;
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, you would use OAuth 2.0 flow here
      // For demo purposes, we'll simulate a successful connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store the mock token
      localStorage.setItem('jira_access_token', 'mock-jira-token-' + Date.now());
      localStorage.setItem('jira_instance_url', 'https://yourcompany.atlassian.net');
      
      setIsConnected(true);
      
      toast({
        title: 'Connected to Jira',
        description: 'Your Jira account has been successfully connected.',
      });
    } catch (error) {
      console.error('Failed to connect to Jira:', error);
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to Jira. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove tokens
      localStorage.removeItem('jira_access_token');
      localStorage.removeItem('jira_instance_url');
      
      setIsConnected(false);
      
      toast({
        title: 'Disconnected from Jira',
        description: 'Your Jira account has been disconnected.',
      });
    } catch (error) {
      console.error('Failed to disconnect from Jira:', error);
      toast({
        title: 'Disconnection Failed',
        description: 'Could not disconnect from Jira. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isConnected,
    isLoading,
    connect,
    disconnect,
  };
}
