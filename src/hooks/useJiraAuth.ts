
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { jiraAuthService } from '@/utils/jira/jiraAuthService';

interface JiraAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  cloudId: string | null;
  error: string | null;
}

export const useJiraAuth = () => {
  const [state, setState] = useState<JiraAuthState>({
    isAuthenticated: false,
    isLoading: true, // Start with loading to prevent flashing of connect form
    token: null,
    cloudId: null,
    error: null,
  });
  const { toast } = useToast();

  // Check if the user is authenticated with Jira
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('jira_token');
        const cloudId = localStorage.getItem('jira_cloud_id');
        
        if (!token || !cloudId) {
          setState({
            isAuthenticated: false,
            isLoading: false,
            token: null,
            cloudId: null,
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
            cloudId,
            error: null,
          });
        } else {
          // Token is invalid, clear it
          logout();
        }
      } catch (error) {
        setState({
          isAuthenticated: false,
          isLoading: false,
          token: null,
          cloudId: null,
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
      const { token, error } = await jiraAuthService.authenticate(cloudId, apiToken);
      
      if (token) {
        // Store connection date in ISO format for better compatibility
        const connectionDate = new Date().toISOString();
        
        localStorage.setItem('jira_token', token);
        localStorage.setItem('jira_cloud_id', cloudId);
        localStorage.setItem('jira_connected_date', connectionDate);
        
        setState({
          isAuthenticated: true,
          isLoading: false,
          token,
          cloudId,
          error: null,
        });
        
        toast({
          title: 'Connected to Jira',
          description: `Successfully connected to Jira workspace: ${cloudId}`,
        });
        
        return true;
      } else {
        setState({
          isAuthenticated: false,
          isLoading: false,
          token: null,
          cloudId: null,
          error: error || 'Authentication failed. Please check your credentials.',
        });
        
        toast({
          title: 'Connection failed',
          description: error || 'Failed to connect to Jira. Please check your credentials.',
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
        cloudId: null,
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
    localStorage.removeItem('jira_connected_date');
    localStorage.removeItem('jira_auto_sync');
    localStorage.removeItem('jira_scan_frequency');
    localStorage.removeItem('jira_compliance_keywords');
    localStorage.removeItem('jira_auto_sync_settings');
    localStorage.removeItem('jira_selected_projects');
    
    setState({
      isAuthenticated: false,
      isLoading: false,
      token: null,
      cloudId: null,
      error: null,
    });
    
    toast({
      title: 'Disconnected from Jira',
      description: 'Successfully disconnected from Jira',
    });
    
    // Force a page reload to ensure all Jira components are properly reset
    window.location.href = '/settings';
  }, [toast]);

  // Get connection date in a more readable format
  const getConnectionDate = useCallback(() => {
    const dateStr = localStorage.getItem('jira_connected_date');
    if (!dateStr) return null;
    
    try {
      // Handle both ISO date string and localized date string
      const date = dateStr.includes('T') 
        ? new Date(dateStr)
        : new Date(dateStr);
      
      return date.toLocaleDateString();
    } catch (e) {
      return dateStr; // Fallback to the raw string
    }
  }, []);

  return {
    ...state,
    login,
    logout,
    getConnectionDate,
  };
};
