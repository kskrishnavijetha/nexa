
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the Telecommunications industry
 */
export const generateTelecomFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'Customer Privacy Protection',
    status: 'Pass',
    criticality: 'High',
    details: 'Customer data privacy measures properly implemented'
  });
  
  findings.push({
    category: 'Communication Infrastructure Security',
    status: stats.inProgress > 3 ? 'Failed' : 'Pass',
    criticality: 'Critical',
    details: stats.inProgress > 3 
      ? 'Network infrastructure security requires remediation' 
      : 'Network infrastructure security properly maintained'
  });
  
  findings.push({
    category: 'FCC Compliance',
    status: stats.totalEvents < 8 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.totalEvents < 8 
      ? 'FCC compliance documentation incomplete' 
      : 'FCC compliance requirements satisfied'
  });
  
  findings.push({
    category: 'CPNI Protection',
    status: stats.completedTasks! < 5 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.completedTasks! < 5 
      ? 'Customer Proprietary Network Information protection inadequate' 
      : 'CPNI protection requirements satisfied'
  });
  
  return findings;
};
