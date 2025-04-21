
import { JiraSettings, JiraProject, JiraIssueType, JiraApiResponse } from '../types';
import { ComplianceRisk, ComplianceReport } from '@/utils/types';
import { AuditEvent } from '@/components/audit/types';

const demoProjects: JiraProject[] = [
  { id: 'demo-1', key: 'DEMO', name: 'Demo Project' },
  { id: 'demo-2', key: 'COMP', name: 'Compliance Project' },
  { id: 'demo-3', key: 'SEC', name: 'Security Project' }
];

const demoIssueTypes: JiraIssueType[] = [
  { id: 'type-1', name: 'Risk', description: 'Compliance Risk' },
  { id: 'type-2', name: 'Bug', description: 'Software Bug' },
  { id: 'type-3', name: 'Task', description: 'General Task' }
];

export const isDemoMode = (settings: JiraSettings): boolean => {
  return settings.domain === 'demo.atlassian.net';
};

export const testDemoConnection = async (): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  return true;
};

export const getDemoProjects = async (): Promise<JiraProject[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  return demoProjects;
};

export const getDemoIssueTypes = async (): Promise<JiraIssueType[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  return demoIssueTypes;
};

export const createDemoIssueForRisk = async (
  risk: ComplianceRisk,
  documentName: string
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
  console.log('Demo: Created Jira issue for risk:', { risk, documentName });
  return true;
};

export const createDemoIssueForAuditEvent = async (
  event: AuditEvent
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
  console.log('Demo: Created Jira issue for audit event:', event);
  return true;
};

export const createDemoIssuesForReport = async (
  report: ComplianceReport
): Promise<number> => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
  const issuesCreated = Math.floor(Math.random() * 3) + 1;
  console.log('Demo: Created Jira issues for report:', { report, issuesCreated });
  return issuesCreated;
};
