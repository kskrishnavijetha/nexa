
import { JiraProject } from './types';

// Mock data for demonstration
const MOCK_PROJECTS: JiraProject[] = [
  { 
    id: 'proj-1', 
    key: 'COMP', 
    name: 'Compliance Project', 
    projectType: 'business', 
    url: 'https://example.atlassian.net/projects/COMP'
  },
  { 
    id: 'proj-2', 
    key: 'SEC', 
    name: 'Security Implementation', 
    projectType: 'software', 
    url: 'https://example.atlassian.net/projects/SEC'
  },
  { 
    id: 'proj-3', 
    key: 'GDPR', 
    name: 'GDPR Implementation', 
    projectType: 'business', 
    url: 'https://example.atlassian.net/projects/GDPR'
  },
  { 
    id: 'proj-4', 
    key: 'HIPAA', 
    name: 'HIPAA Compliance', 
    projectType: 'business', 
    url: 'https://example.atlassian.net/projects/HIPAA'
  },
  { 
    id: 'proj-5', 
    key: 'SOC', 
    name: 'SOC 2 Implementation', 
    projectType: 'business', 
    url: 'https://example.atlassian.net/projects/SOC'
  }
];

/**
 * Get all projects from Jira
 */
const getProjects = async (): Promise<JiraProject[]> => {
  try {
    // In a real implementation, this would fetch from the Jira API
    // For demo purposes, we'll return mock data
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return MOCK_PROJECTS;
  } catch (error) {
    console.error('Error fetching Jira projects:', error);
    throw new Error('Failed to fetch Jira projects');
  }
};

/**
 * Get a specific project by ID
 */
const getProjectById = async (projectId: string): Promise<JiraProject | null> => {
  try {
    // In a real implementation, this would fetch from the Jira API
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return MOCK_PROJECTS.find(p => p.id === projectId) || null;
  } catch (error) {
    console.error(`Error fetching Jira project ${projectId}:`, error);
    throw new Error('Failed to fetch Jira project');
  }
};

export const jiraProjectService = {
  getProjects,
  getProjectById,
};
