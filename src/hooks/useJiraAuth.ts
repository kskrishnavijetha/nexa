
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
    isLoading: true,
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
    setState(prev => ({ ...prev, isLoading: true }));
    
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
          error: 'Authentication failed',
        });
        
        toast({
          title: 'Connection failed',
          description: 'Failed to connect to Jira. Please check your credentials.',
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (error) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        token: null,
        error: 'Authentication error',
      });
      
      toast({
        title: 'Connection error',
        description: 'An error occurred while connecting to Jira.',
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
