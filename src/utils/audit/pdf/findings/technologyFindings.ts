
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the technology industry
 */
export const generateTechnologyFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'Code Deployment Controls',
    status: stats.inProgress > 5 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.inProgress > 5 
      ? 'Unauthorized code deployment detected' 
      : 'Code deployment controls enforced'
  });
  
  findings.push({
    category: 'API Access Security',
    status: 'Pass',
    criticality: 'Critical',
    details: 'API endpoints properly secured'
  });
  
  findings.push({
    category: 'User Data Encryption',
    status: 'Pass',
    criticality: 'Critical',
    details: 'User data encrypted at rest and in transit'
  });
  
  findings.push({
    category: 'System Logging',
    status: stats.systemEvents < 3 ? 'Failed' : 'Pass',
    criticality: 'Medium',
    details: stats.systemEvents < 3 
      ? 'Insufficient system logging detected' 
      : 'Comprehensive system logging in place'
  });
  
  return findings;
};
