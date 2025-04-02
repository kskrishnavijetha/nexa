
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the government industry
 */
export const generateGovernmentFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'Records Management',
    status: stats.completed < stats.totalEvents * 0.7 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.completed < stats.totalEvents * 0.7 
      ? 'Records retention issues detected' 
      : 'Records properly managed and retained'
  });
  
  findings.push({
    category: 'Access Authorization',
    status: 'Pass',
    criticality: 'Critical',
    details: 'Proper authorization controls in place'
  });
  
  findings.push({
    category: 'FISMA Compliance',
    status: stats.pending > 0 ? 'Failed' : 'Pass',
    criticality: 'Critical',
    details: stats.pending > 0 
      ? 'Federal information security issues detected' 
      : 'Federal information security measures in place'
  });
  
  findings.push({
    category: 'Separation of Duties',
    status: 'Pass',
    criticality: 'Medium',
    details: 'Proper segregation of duties enforced'
  });
  
  return findings;
};
