
import { JiraProject } from './types';

/**
 * Get all projects from Jira
 */
const getProjects = async (): Promise<JiraProject[]> => {
  try {
    const response = await fetch('/api/jira/projects');
    if (!response.ok) {
      throw new Error('Failed to fetch Jira projects');
    }
    return response.json();
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
    const response = await fetch(`/api/jira/projects/${projectId}`);
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching Jira project ${projectId}:`, error);
    throw new Error('Failed to fetch Jira project');
  }
};

export const jiraProjectService = {
  getProjects,
  getProjectById,
};

