
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface JiraDemoState {
  isDemoMode: boolean;
  isLoading: boolean;
  demoCloudId: string;
}

export const useJiraDemoMode = () => {
  const [state, setState] = useState<JiraDemoState>({
    isDemoMode: false,
    isLoading: false,
    demoCloudId: 'demo-workspace',
  });

  const enableDemoMode = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set demo mode credentials
      localStorage.setItem('jira_demo_mode', 'true');
      localStorage.setItem('jira_token', 'demo:demo@example.com:demo-token:demo-auth');
      localStorage.setItem('jira_cloud_id', 'demo-workspace');
      localStorage.setItem('jira_connected_date', new Date().toISOString());
      
      setState({
        isDemoMode: true,
        isLoading: false,
        demoCloudId: 'demo-workspace',
      });
      
      toast.success('Demo mode enabled! Exploring sample Jira workspace.');
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('Failed to enable demo mode');
      return false;
    }
  }, []);

  const disableDemoMode = useCallback(() => {
    localStorage.removeItem('jira_demo_mode');
    localStorage.removeItem('jira_token');
    localStorage.removeItem('jira_cloud_id');
    localStorage.removeItem('jira_connected_date');
    
    setState({
      isDemoMode: false,
      isLoading: false,
      demoCloudId: '',
    });
    
    toast.success('Demo mode disabled');
  }, []);

  const checkDemoMode = useCallback(() => {
    const isDemo = localStorage.getItem('jira_demo_mode') === 'true';
    setState(prev => ({ ...prev, isDemoMode: isDemo }));
    return isDemo;
  }, []);

  return {
    ...state,
    enableDemoMode,
    disableDemoMode,
    checkDemoMode,
  };
};
