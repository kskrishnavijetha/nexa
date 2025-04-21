
import { JiraSettings } from '@/components/settings/jira/types';

export interface JiraApiResponse {
  [key: string]: any;
}

export interface JiraRequestOptions extends RequestInit {
  headers?: HeadersInit;
}

// Re-export these types from components to use in the Jira utilities
export interface JiraProject {
  id: string;
  key: string;
  name: string;
}

export interface JiraIssueType {
  id: string;
  name: string;
  description?: string;
}

export type { JiraSettings };
