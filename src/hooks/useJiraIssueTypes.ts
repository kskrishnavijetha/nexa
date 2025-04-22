
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface JiraIssueType {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  subtask: boolean;
}

interface UseJiraIssueTypesReturn {
  issueTypes: JiraIssueType[];
  isLoading: boolean;
  error: Error | null;
  syncIssueTypes: () => Promise<void>;
  selectedIssueTypes: string[];
  toggleIssueType: (id: string) => void;
}

export function useJiraIssueTypes(): UseJiraIssueTypesReturn {
  const [issueTypes, setIssueTypes] = useState<JiraIssueType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<string[]>([]);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockIssueTypes: JiraIssueType[] = [
    { 
      id: '10000', 
      name: 'Bug', 
      description: 'A problem which impairs or prevents the functions of the product.',
      iconUrl: 'https://your-domain.atlassian.net/secure/viewavatar?size=medium&avatarId=10303',
      subtask: false
    },
    { 
      id: '10001', 
      name: 'Story', 
      description: 'A user story.',
      iconUrl: 'https://your-domain.atlassian.net/secure/viewavatar?size=medium&avatarId=10315',
      subtask: false
    },
    { 
      id: '10002', 
      name: 'Task', 
      description: 'A task that needs to be done.',
      iconUrl: 'https://your-domain.atlassian.net/secure/viewavatar?size=medium&avatarId=10318',
      subtask: false
    },
    { 
      id: '10003', 
      name: 'Epic', 
      description: 'A big user story that needs to be broken down.',
      iconUrl: 'https://your-domain.atlassian.net/secure/viewavatar?size=medium&avatarId=10307',
      subtask: false
    },
    { 
      id: '10004', 
      name: 'Subtask', 
      description: 'A sub-task of a parent task.',
      iconUrl: 'https://your-domain.atlassian.net/secure/viewavatar?size=medium&avatarId=10316',
      subtask: true
    },
  ];

  const syncIssueTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would fetch issue types from Jira API
      setIssueTypes(mockIssueTypes);
      
      toast({
        title: 'Issue Types Synced',
        description: `Successfully synced ${mockIssueTypes.length} issue types from Jira.`,
      });
    } catch (err) {
      const error = err as Error;
      console.error('Failed to sync Jira issue types:', error);
      setError(error);
      
      toast({
        title: 'Sync Failed',
        description: 'Could not sync issue types from Jira.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load issue types on initial render if connected
  useEffect(() => {
    const jiraToken = localStorage.getItem('jira_access_token');
    
    if (jiraToken && issueTypes.length === 0) {
      syncIssueTypes();
    }
  }, [syncIssueTypes, issueTypes.length]);

  const toggleIssueType = useCallback((id: string) => {
    setSelectedIssueTypes(prev => {
      if (prev.includes(id)) {
        return prev.filter(issueTypeId => issueTypeId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  return {
    issueTypes,
    isLoading,
    error,
    syncIssueTypes,
    selectedIssueTypes,
    toggleIssueType,
  };
}
