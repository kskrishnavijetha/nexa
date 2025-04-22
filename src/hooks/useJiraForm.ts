
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface JiraProject {
  key: string;
  name: string;
}

export interface JiraIssueType {
  name: string;
  description?: string;
}

interface UseJiraFormReturn {
  projects: JiraProject[];
  issueTypes: JiraIssueType[];
  addProject: (project: JiraProject) => Promise<void>;
  addIssueType: (issueType: JiraIssueType) => Promise<void>;
}

export function useJiraForm(): UseJiraFormReturn {
  const [projects, setProjects] = useState<JiraProject[]>(() => {
    // Initialize from localStorage if available
    const storedProjects = localStorage.getItem('jira_projects');
    return storedProjects ? JSON.parse(storedProjects) : [];
  });
  
  const [issueTypes, setIssueTypes] = useState<JiraIssueType[]>(() => {
    // Initialize from localStorage if available
    const storedIssueTypes = localStorage.getItem('jira_issue_types');
    return storedIssueTypes ? JSON.parse(storedIssueTypes) : [];
  });
  
  const { toast } = useToast();
  
  const addProject = useCallback(async (project: JiraProject) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedProjects = [...projects, project];
      setProjects(updatedProjects);
      
      // Save to localStorage
      localStorage.setItem('jira_projects', JSON.stringify(updatedProjects));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to add project:', error);
      toast({
        title: 'Error',
        description: 'Failed to add project.',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }
  }, [projects, toast]);
  
  const addIssueType = useCallback(async (issueType: JiraIssueType) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedIssueTypes = [...issueTypes, issueType];
      setIssueTypes(updatedIssueTypes);
      
      // Save to localStorage
      localStorage.setItem('jira_issue_types', JSON.stringify(updatedIssueTypes));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to add issue type:', error);
      toast({
        title: 'Error',
        description: 'Failed to add issue type.',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }
  }, [issueTypes, toast]);
  
  return {
    projects,
    issueTypes,
    addProject,
    addIssueType,
  };
}
