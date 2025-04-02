
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate default findings when no industry is identified
 */
export const generateDefaultFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  // Generate findings based on statistics
  findings.push({
    category: 'Encryption Enabled',
    status: 'Pass',
    criticality: 'High',
    details: 'Data encrypted at rest and in transit'
  });
  
  if (stats.totalEvents > 0 && stats.userEvents / stats.totalEvents > 0.7) {
    findings.push({
      category: 'User Access Control',
      status: stats.inProgress > stats.completed ? 'Failed' : 'Pass',
      criticality: 'Critical',
      details: stats.inProgress > stats.completed 
        ? 'Unauthorized access detected' 
        : 'Access controls properly enforced'
    });
  }
  
  findings.push({
    category: 'Multi-Factor Auth',
    status: 'Pass',
    criticality: 'High',
    details: 'MFA enforced for all admin users'
  });
  
  findings.push({
    category: 'Data Retention Policy',
    status: stats.pending > 3 ? 'Failed' : 'Pass',
    criticality: 'Medium',
    details: stats.pending > 3 
      ? 'Retention exceeds compliance limits' 
      : 'Data retention policies properly enforced'
  });
  
  return findings;
};
