import { JiraProject } from './types';

// Define the missing MOCK_PROJECTS constant
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
    projectType: 'service',
    url: 'https://example.atlassian.net/projects/GDPR'
  },
  {
    id: 'proj-4',
    key: 'HIPAA',
    name: 'HIPAA Compliance',
    projectType: 'business',
    url: 'https://example.atlassian.net/projects/HIPAA'
  }
];

// Existing demo projects, now with additional demo mode logic
const generateDemoProjects = (count: number = 5): JiraProject[] => {
  const projectTypes = ['business', 'software', 'service'];
  const complianceAreas = ['SOC 2', 'HIPAA', 'PCI DSS', 'GDPR', 'ISO 27001'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: `demo-proj-${index + 1}`,
    key: `DEMO${index + 1}`,
    name: `${complianceAreas[index % complianceAreas.length]} Compliance Project`,
    projectType: projectTypes[index % projectTypes.length],
    url: `https://example.atlassian.net/projects/DEMO${index + 1}`
  }));
};

/**
 * Get all projects from Jira
 */
const getProjects = async (): Promise<JiraProject[]> => {
  try {
    // Check if demo mode is enabled in localStorage
    const isDemoMode = localStorage.getItem('jira_demo_mode') === 'true';
    
    // Use generated demo projects if demo mode is on, otherwise use existing mock projects
    return isDemoMode 
      ? generateDemoProjects() 
      : MOCK_PROJECTS;
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
