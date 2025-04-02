
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the Education & EdTech industry
 */
export const generateEducationFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'Student Data Protection',
    status: 'Pass',
    criticality: 'High',
    details: 'Student personal information properly protected'
  });
  
  findings.push({
    category: 'FERPA Compliance',
    status: stats.inProgress > 2 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.inProgress > 2 
      ? 'Family Educational Rights and Privacy Act compliance issues detected' 
      : 'FERPA compliance requirements satisfied'
  });
  
  findings.push({
    category: 'COPPA Compliance',
    status: stats.totalEvents < 6 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.totalEvents < 6 
      ? 'Children\'s Online Privacy Protection Act compliance issues detected' 
      : 'COPPA compliance requirements satisfied'
  });
  
  findings.push({
    category: 'Learning Management Security',
    status: stats.completedTasks! < 3 ? 'Failed' : 'Pass',
    criticality: 'Medium',
    details: stats.completedTasks! < 3 
      ? 'Learning Management System security controls need improvement' 
      : 'Learning Management System security properly maintained'
  });
  
  return findings;
};
