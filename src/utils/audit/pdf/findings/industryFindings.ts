
import { Industry } from '@/utils/types';
import { AuditReportStatistics, ComplianceFinding } from '../../types';
import { generateDefaultFindings } from './baseFindings';
import { generateHealthcareFindings } from './healthcareFindings';
import { generateFinanceFindings } from './financeFindings';
import { generateRetailFindings } from './retailFindings';
import { generateTechnologyFindings } from './technologyFindings';
import { generateGovernmentFindings } from './governmentFindings';
import { generateEnergyFindings } from './energyFindings';
import { generateTelecomFindings } from './telecomFindings';
import { generateManufacturingFindings } from './manufacturingFindings';
import { generateEducationFindings } from './educationFindings';
import { generateLegalFindings } from './legalFindings';
import { generateInsuranceFindings } from './insuranceFindings';
import { generatePharmaFindings } from './pharmaFindings';

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
    case 'Energy & Utilities':
      return generateEnergyFindings(stats);
    case 'Telecommunications':
      return generateTelecomFindings(stats);
    case 'Manufacturing & IoT':
      return generateManufacturingFindings(stats);
    case 'Education & EdTech':
      return generateEducationFindings(stats);
    case 'Legal & Consulting':
      return generateLegalFindings(stats);
    case 'Insurance':
      return generateInsuranceFindings(stats);
    case 'Pharmaceutical & Life Sciences':
      return generatePharmaFindings(stats);
    default:
      return generateDefaultFindings(stats);
  }
};
