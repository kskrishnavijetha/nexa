
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { jiraAuthService } from '@/utils/jira/jiraAuthService';

interface JiraAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;
}

export const useJiraAuth = () => {
  const [state, setState] = useState<JiraAuthState>({
    isAuthenticated: false,
    isLoading: true, // Start with loading to prevent flashing of connect form
    token: null,
    error: null,
  });
  const { toast } = useToast();

  // Check if the user is authenticated with Jira
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('jira_token');
        
        if (!token) {
          setState({
            isAuthenticated: false,
            isLoading: false,
            token: null,
            error: null,
          });
          return;
        }

        // Validate the token with Jira
        const isValid = await jiraAuthService.validateToken(token);
        
        if (isValid) {
          setState({
            isAuthenticated: true,
            isLoading: false,
            token,
            error: null,
          });
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('jira_token');
          localStorage.removeItem('jira_cloud_id');
          setState({
            isAuthenticated: false,
            isLoading: false,
            token: null,
            error: 'Invalid or expired token',
          });
        }
      } catch (error) {
        setState({
          isAuthenticated: false,
          isLoading: false,
          token: null,
          error: 'Failed to validate authentication',
        });
      }
    };

    checkAuthStatus();
  }, []);

  // Login to Jira
  const login = useCallback(async (cloudId: string, apiToken: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const token = await jiraAuthService.authenticate(cloudId, apiToken);
      
      if (token) {
        localStorage.setItem('jira_token', token);
        localStorage.setItem('jira_cloud_id', cloudId);
        
        setState({
          isAuthenticated: true,
          isLoading: false,
          token,
          error: null,
        });
        
        toast({
          title: 'Connected to Jira',
          description: 'Successfully connected to your Jira workspace',
        });
        
        return true;
      } else {
        setState({
          isAuthenticated: false,
          isLoading: false,
          token: null,
          error: 'Authentication failed. Please check your credentials.',
        });
        
        toast({
          title: 'Connection failed',
          description: 'Failed to connect to Jira. Please check your credentials.',
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while connecting to Jira';
      
      setState({
        isAuthenticated: false,
        isLoading: false,
        token: null,
        error: errorMessage,
      });
      
      toast({
        title: 'Connection error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  }, [toast]);

  // Logout from Jira
  const logout = useCallback(() => {
    localStorage.removeItem('jira_token');
    localStorage.removeItem('jira_cloud_id');
    
    setState({
      isAuthenticated: false,
      isLoading: false,
      token: null,
      error: null,
    });
    
    toast({
      title: 'Disconnected',
      description: 'Successfully disconnected from Jira',
    });
  }, [toast]);

  return {
    ...state,
    login,
    logout,
  };
};
