
import { ComplianceIssue, JiraFilter, JiraIssue } from './types';
import { complianceFrameworkService } from './complianceFrameworkService';

// Mock data for demonstration
const MOCK_ISSUES: ComplianceIssue[] = [
  {
    id: 'issue-1',
    key: 'COMP-123',
    summary: 'Implement secure password policy',
    description: 'We need to implement a secure password policy for all user accounts.',
    status: 'To Do',
    priority: 'High',
    created: '2023-04-15T10:30:00Z',
    updated: '2023-04-16T14:45:00Z',
    projectId: 'proj-1',
    projectKey: 'COMP',
    projectName: 'Compliance Project',
    issueType: {
      name: 'Task',
    },
    complianceFrameworks: ['SOC 2', 'ISO 27001'],
    complianceControls: ['CC6.1', 'A.9.4.3'],
    riskScore: 85,
    keywordMatches: ['password policy', 'access control'],
    isHighRisk: true,
    dueDate: '2023-05-15T00:00:00Z',
  },
  {
    id: 'issue-2',
    key: 'COMP-124',
    summary: 'Update data encryption standards',
    description: 'Update our encryption standards to meet the latest compliance requirements.',
    status: 'In Progress',
    priority: 'Medium',
    created: '2023-04-16T09:20:00Z',
    updated: '2023-04-17T11:30:00Z',
    projectId: 'proj-1',
    projectKey: 'COMP',
    projectName: 'Compliance Project',
    issueType: {
      name: 'Task',
    },
    complianceFrameworks: ['HIPAA', 'PCI DSS'],
    complianceControls: ['§164.312(a)(2)(iv)', 'Req-3.4'],
    riskScore: 60,
    keywordMatches: ['encryption', 'data protection'],
    isHighRisk: true,
  },
  {
    id: 'issue-3',
    key: 'SEC-45',
    summary: 'Implement audit logging',
    description: 'Implement comprehensive audit logging for all system access.',
    status: 'Done',
    priority: 'High',
    created: '2023-04-10T08:15:00Z',
    updated: '2023-04-14T16:20:00Z',
    projectId: 'proj-2',
    projectKey: 'SEC',
    projectName: 'Security Implementation',
    issueType: {
      name: 'Story',
    },
    complianceFrameworks: ['SOC 2', 'GDPR'],
    complianceControls: ['CC7.2', 'Art. 30'],
    riskScore: 40,
    keywordMatches: ['audit log', 'monitoring'],
    isHighRisk: false,
  },
  {
    id: 'issue-4',
    key: 'GDPR-89',
    summary: 'Update privacy policy',
    description: 'Update our privacy policy to comply with GDPR requirements.',
    status: 'To Do',
    priority: 'Medium',
    created: '2023-04-18T13:45:00Z',
    updated: '2023-04-18T13:45:00Z',
    projectId: 'proj-3',
    projectKey: 'GDPR',
    projectName: 'GDPR Implementation',
    issueType: {
      name: 'Task',
    },
    complianceFrameworks: ['GDPR'],
    complianceControls: ['Art. 12', 'Art. 13', 'Art. 14'],
    riskScore: 50,
    keywordMatches: ['privacy policy', 'consent'],
    isHighRisk: false,
  },
  {
    id: 'issue-5',
    key: 'HIPAA-32',
    summary: 'Implement data access controls',
    description: 'Implement role-based access controls for PHI data.',
    status: 'In Progress',
    priority: 'High',
    created: '2023-04-12T10:00:00Z',
    updated: '2023-04-19T09:30:00Z',
    projectId: 'proj-4',
    projectKey: 'HIPAA',
    projectName: 'HIPAA Compliance',
    issueType: {
      name: 'Story',
    },
    complianceFrameworks: ['HIPAA'],
    complianceControls: ['§164.308(a)(4)', '§164.312(a)(1)'],
    riskScore: 75,
    keywordMatches: ['access control', 'PHI'],
    isHighRisk: true,
  },
];

/**
 * Get compliance issues from Jira based on filter criteria
 */
const getComplianceIssues = async (filter?: JiraFilter): Promise<ComplianceIssue[]> => {
  try {
    // In a real implementation, this would fetch from the Jira API and analyze issues
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    let filteredIssues = [...MOCK_ISSUES];
    
    if (filter) {
      if (filter.projectKeys && filter.projectKeys.length > 0) {
        filteredIssues = filteredIssues.filter(issue => 
          filter.projectKeys!.includes(issue.projectKey)
        );
      }
      
      if (filter.statuses && filter.statuses.length > 0) {
        filteredIssues = filteredIssues.filter(issue => 
          filter.statuses!.includes(issue.status)
        );
      }
      
      if (filter.priorities && filter.priorities.length > 0) {
        filteredIssues = filteredIssues.filter(issue => 
          filter.priorities!.includes(issue.priority)
        );
      }
      
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        filteredIssues = filteredIssues.filter(issue => 
          issue.summary.toLowerCase().includes(term) ||
          issue.description?.toLowerCase().includes(term) ||
          issue.complianceFrameworks.some(framework => 
            framework.toLowerCase().includes(term)
          )
        );
      }
      
      // Date filtering would be added here
    }
    
    return filteredIssues;
  } catch (error) {
    console.error('Error fetching compliance issues:', error);
    throw new Error('Failed to fetch compliance issues');
  }
};

/**
 * Update issue with compliance metadata
 */
const updateIssueWithComplianceData = async (issueKey: string, complianceData: Partial<ComplianceIssue>): Promise<boolean> => {
  try {
    // In a real implementation, this would update the issue in Jira
    console.log(`Updating issue ${issueKey} with compliance data:`, complianceData);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    return true;
  } catch (error) {
    console.error(`Error updating issue ${issueKey}:`, error);
    return false;
  }
};

export const jiraIssueService = {
  getComplianceIssues,
  updateIssueWithComplianceData,
};
