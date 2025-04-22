
import { useState } from 'react';
import { JiraProject } from '@/utils/jira/types';

interface JiraIssueType {
  id: string;
  name: string;
  description?: string;
}

export const useJiraForm = () => {
  const [projects, setProjects] = useState<JiraProject[]>([
    { id: 'proj-1', key: 'COMP', name: 'Compliance Project', projectType: 'business', url: 'https://example.atlassian.net/projects/COMP' },
    { id: 'proj-2', key: 'SEC', name: 'Security Implementation', projectType: 'software', url: 'https://example.atlassian.net/projects/SEC' }
  ]);
  
  const [issueTypes, setIssueTypes] = useState<JiraIssueType[]>([
    { id: 'type-1', name: 'Task', description: 'A task that needs to be done' },
    { id: 'type-2', name: 'Bug', description: 'A problem which impairs or prevents the functions of the product' },
    { id: 'type-3', name: 'Compliance Issue', description: 'An issue related to regulatory compliance' }
  ]);

  const addProject = async (project: Omit<JiraProject, 'id' | 'projectType' | 'url'>) => {
    // Create a full JiraProject object with all required properties
    const newProject: JiraProject = {
      id: `proj-${Date.now()}`,
      key: project.key,
      name: project.name,
      projectType: 'business', // Default project type
      url: `https://example.atlassian.net/projects/${project.key}`
    };
    
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const addIssueType = async (issueType: Omit<JiraIssueType, 'id'>) => {
    const newIssueType = {
      id: `type-${Date.now()}`,
      name: issueType.name,
      description: issueType.description
    };
    
    setIssueTypes(prev => [...prev, newIssueType]);
    return newIssueType;
  };

  return {
    projects,
    issueTypes,
    addProject,
    addIssueType
  };
};
