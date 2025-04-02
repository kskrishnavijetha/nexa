
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
import { generateAutomotiveFindings } from './automotiveFindings';
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
    case 'E-Commerce':
    case 'Retail & Consumer':
      return generateRetailFindings(stats);
    case 'Cloud & SaaS':
      return generateTechnologyFindings(stats);
    case 'Government & Defense':
      return generateGovernmentFindings(stats);
    case 'Energy & Utilities':
      return generateEnergyFindings(stats);
    case 'Telecom':
      return generateTelecomFindings(stats);
    case 'Manufacturing & Supply Chain':
      return generateManufacturingFindings(stats);
    case 'Education':
      return generateEducationFindings(stats);
    case 'Automotive':
      return generateAutomotiveFindings(stats);
    case 'Pharmaceutical & Biotech':
      return generatePharmaFindings(stats);
    default:
      return generateDefaultFindings(stats);
  }
};
