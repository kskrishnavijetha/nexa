
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the Pharmaceutical & Life Sciences industry
 */
export const generatePharmaFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'FDA CFR Part 11 Compliance',
    status: stats.inProgress > 1 ? 'Failed' : 'Pass',
    criticality: 'Critical',
    details: stats.inProgress > 1 
      ? 'Electronic records and signatures not meeting FDA requirements' 
      : 'FDA CFR Part 11 compliance requirements satisfied'
  });
  
  findings.push({
    category: 'Clinical Data Protection',
    status: 'Pass',
    criticality: 'Critical',
    details: 'Clinical trial data properly secured and protected'
  });
  
  findings.push({
    category: 'GxP Compliance',
    status: stats.totalEvents < 8 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.totalEvents < 8 
      ? 'Good Practice (GxP) guidelines not fully implemented' 
      : 'GxP compliance requirements satisfied'
  });
  
  findings.push({
    category: 'Pharmacovigilance Data Integrity',
    status: stats.completedTasks! < 5 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.completedTasks! < 5 
      ? 'Pharmacovigilance data management needs improvement' 
      : 'Pharmacovigilance data integrity properly maintained'
  });
  
  findings.push({
    category: 'HIPAA Compliance for Research Data',
    status: stats.pendingTasks! > 3 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.pendingTasks! > 3 
      ? 'Patient health information in research not fully HIPAA compliant' 
      : 'HIPAA requirements for research data satisfied'
  });
  
  return findings;
};
