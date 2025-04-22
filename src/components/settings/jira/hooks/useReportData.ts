
import { jiraIssueService } from '@/utils/jira/jiraIssueService';
import { ComplianceReport } from '@/utils/types';
import { createComplianceReport } from '../utils/reportTransformers';

export const useReportData = () => {
  const prepareReportData = async (documentId: string): Promise<ComplianceReport> => {
    const issues = await jiraIssueService.getComplianceIssues();
    return createComplianceReport(documentId, issues);
  };

  return { prepareReportData };
};
