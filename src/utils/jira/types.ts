
import { JiraSettings } from '@/components/settings/jira/types';

export interface JiraApiResponse {
  [key: string]: any;
}

export interface JiraRequestOptions extends RequestInit {
  headers?: HeadersInit;
}

export type { JiraSettings };
