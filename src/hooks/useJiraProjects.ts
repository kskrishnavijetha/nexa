
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  avatarUrls?: { [key: string]: string };
}

interface UseJiraProjectsReturn {
  projects: JiraProject[];
  isLoading: boolean;
  error: Error | null;
  syncProjects: () => Promise<void>;
  selectedProjects: string[];
  toggleProject: (id: string) => void;
}

export function useJiraProjects(): UseJiraProjectsReturn {
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockProjects: JiraProject[] = [
    { id: '10000', key: 'PROJ', name: 'Sample Project', projectTypeKey: 'software' },
    { id: '10001', key: 'NEXABLOOM', name: 'NexaBloom Development', projectTypeKey: 'software' },
    { id: '10002', key: 'SUPPORT', name: 'Customer Support', projectTypeKey: 'service_desk' },
    { id: '10003', key: 'DOCS', name: 'Documentation', projectTypeKey: 'business' },
  ];

  const syncProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would fetch projects from Jira API
      setProjects(mockProjects);
      
      toast({
        title: 'Projects Synced',
        description: `Successfully synced ${mockProjects.length} projects from Jira.`,
      });
    } catch (err) {
      const error = err as Error;
      console.error('Failed to sync Jira projects:', error);
      setError(error);
      
      toast({
        title: 'Sync Failed',
        description: 'Could not sync projects from Jira.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load projects on initial render if connected
  useEffect(() => {
    const jiraToken = localStorage.getItem('jira_access_token');
    
    if (jiraToken && projects.length === 0) {
      syncProjects();
    }
  }, [syncProjects, projects.length]);

  const toggleProject = useCallback((id: string) => {
    setSelectedProjects(prev => {
      if (prev.includes(id)) {
        return prev.filter(projectId => projectId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  return {
    projects,
    isLoading,
    error,
    syncProjects,
    selectedProjects,
    toggleProject,
  };
}
