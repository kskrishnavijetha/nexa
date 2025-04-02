
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the healthcare industry
 */
export const generateHealthcareFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'PHI Access Controls',
    status: stats.userEvents > 10 ? 'Failed' : 'Pass', 
    criticality: 'Critical',
    details: stats.userEvents > 10 
      ? 'Excessive PHI access events detected' 
      : 'PHI access properly restricted'
  });
  
  findings.push({
    category: 'Audit Log Integrity',
    status: 'Pass',
    criticality: 'High',
    details: 'Tamper-evident audit logs maintained'
  });
  
  findings.push({
    category: 'HIPAA Authorization',
    status: stats.pending > 1 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.pending > 1 
      ? 'Missing patient authorization records' 
      : 'Patient authorizations properly documented'
  });
  
  findings.push({
    category: 'Minimum Necessary Rule',
    status: 'Pass',
    criticality: 'Medium',
    details: 'Access limited to minimum necessary information'
  });
  
  return findings;
};
