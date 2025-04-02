
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the Insurance industry
 */
export const generateInsuranceFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'Customer Data Protection',
    status: 'Pass',
    criticality: 'High',
    details: 'Customer personal information properly protected'
  });
  
  findings.push({
    category: 'Claims Processing Security',
    status: stats.inProgress > 2 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.inProgress > 2 
      ? 'Claims processing security issues detected' 
      : 'Claims processing security properly maintained'
  });
  
  findings.push({
    category: 'Underwriting Data Integrity',
    status: stats.totalEvents < 6 ? 'Failed' : 'Pass',
    criticality: 'Medium',
    details: stats.totalEvents < 6 
      ? 'Underwriting data integrity needs improvement' 
      : 'Underwriting data integrity properly maintained'
  });
  
  findings.push({
    category: 'NYDFS Cybersecurity Compliance',
    status: stats.completedTasks! < 4 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.completedTasks! < 4 
      ? 'NYDFS Cybersecurity Regulation compliance issues detected' 
      : 'NYDFS Cybersecurity Regulation requirements satisfied'
  });
  
  return findings;
};
