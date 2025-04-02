
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the Manufacturing & IoT industry
 */
export const generateManufacturingFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'ICS Security',
    status: stats.inProgress > 2 ? 'Failed' : 'Pass',
    criticality: 'Critical',
    details: stats.inProgress > 2 
      ? 'Industrial Control System security requires immediate attention' 
      : 'Industrial Control System security properly maintained'
  });
  
  findings.push({
    category: 'IoT Device Compliance',
    status: stats.totalEvents < 7 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.totalEvents < 7 
      ? 'IoT device security standards not fully implemented' 
      : 'IoT device security standards properly enforced'
  });
  
  findings.push({
    category: 'Supply Chain Security',
    status: 'Pass',
    criticality: 'Medium',
    details: 'Supply chain security controls adequately implemented'
  });
  
  findings.push({
    category: 'IEC 62443 Compliance',
    status: stats.completedTasks < 4 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.completedTasks < 4 
      ? 'IEC 62443 compliance requirements not fully satisfied' 
      : 'IEC 62443 compliance requirements satisfied'
  });
  
  return findings;
};
