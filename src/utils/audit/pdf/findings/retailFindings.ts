
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the retail industry
 */
export const generateRetailFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'Customer Data Protection',
    status: 'Pass',
    criticality: 'High',
    details: 'Customer PII properly secured'
  });
  
  findings.push({
    category: 'Payment Processing',
    status: stats.inProgress > 2 ? 'Failed' : 'Pass',
    criticality: 'Critical',
    details: stats.inProgress > 2 
      ? 'Payment processing issues detected' 
      : 'Payment processing properly secured'
  });
  
  findings.push({
    category: 'Inventory Audit Trail',
    status: stats.totalEvents < 5 ? 'Failed' : 'Pass',
    criticality: 'Medium',
    details: stats.totalEvents < 5 
      ? 'Insufficient inventory tracking events' 
      : 'Inventory changes properly tracked'
  });
  
  findings.push({
    category: 'Return Policy Compliance',
    status: 'Pass',
    criticality: 'Low',
    details: 'Return policy properly enforced'
  });
  
  return findings;
};
