
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the Energy & Utilities industry
 */
export const generateEnergyFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'Critical Infrastructure Protection',
    status: stats.inProgress > 2 ? 'Failed' : 'Pass',
    criticality: 'Critical',
    details: stats.inProgress > 2 
      ? 'Critical infrastructure security controls need immediate attention' 
      : 'Critical infrastructure security controls properly implemented'
  });
  
  findings.push({
    category: 'NERC CIP Compliance',
    status: stats.totalEvents < 10 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.totalEvents < 10 
      ? 'Insufficient evidence of NERC CIP compliance' 
      : 'NERC CIP compliance requirements satisfied'
  });
  
  findings.push({
    category: 'Smart Grid Security',
    status: 'Pass',
    criticality: 'Medium',
    details: 'Smart grid security measures in place and effective'
  });
  
  findings.push({
    category: 'Environmental Compliance',
    status: stats.completedTasks! < 3 ? 'Failed' : 'Pass',
    criticality: 'Medium',
    details: stats.completedTasks! < 3 
      ? 'Environmental compliance reporting incomplete' 
      : 'Environmental compliance reporting up to date'
  });
  
  return findings;
};
