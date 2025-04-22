
import { useState } from 'react';

interface JiraProject {
  id: string;
  key: string;
  name: string;
}

interface JiraIssueType {
  id: string;
  name: string;
  description?: string;
}

export const useJiraForm = () => {
  const [projects, setProjects] = useState<JiraProject[]>([
    { id: 'proj-1', key: 'COMP', name: 'Compliance Project' },
    { id: 'proj-2', key: 'SEC', name: 'Security Implementation' }
  ]);
  
  const [issueTypes, setIssueTypes] = useState<JiraIssueType[]>([
    { id: 'type-1', name: 'Task', description: 'A task that needs to be done' },
    { id: 'type-2', name: 'Bug', description: 'A problem which impairs or prevents the functions of the product' },
    { id: 'type-3', name: 'Compliance Issue', description: 'An issue related to regulatory compliance' }
  ]);

  const addProject = async (project: Omit<JiraProject, 'id'>) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      key: project.key,
      name: project.name
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
