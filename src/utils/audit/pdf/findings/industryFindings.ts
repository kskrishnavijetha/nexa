
import { Industry } from '@/utils/types';
import { AuditReportStatistics, ComplianceFinding } from '../../types';
import { generateDefaultFindings } from './baseFindings';
import { generateHealthcareFindings } from './healthcareFindings';
import { generateFinanceFindings } from './financeFindings';
import { generateRetailFindings } from './retailFindings';
import { generateTechnologyFindings } from './technologyFindings';
import { generateGovernmentFindings } from './governmentFindings';

/**
 * Generate industry-specific findings
 */
export const generateIndustryFindings = (stats: AuditReportStatistics, industry: Industry): ComplianceFinding[] => {
  switch (industry) {
    case 'Healthcare':
      return generateHealthcareFindings(stats);
    case 'Finance & Banking':
      return generateFinanceFindings(stats);
    case 'E-commerce & Retail':
      return generateRetailFindings(stats);
    case 'Cloud & SaaS':
      return generateTechnologyFindings(stats);
    case 'Government & Defense':
      return generateGovernmentFindings(stats);
    default:
      return generateDefaultFindings(stats);
  }
};
