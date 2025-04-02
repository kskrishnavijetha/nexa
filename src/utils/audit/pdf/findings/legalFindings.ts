
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the Legal & Consulting industry
 */
export const generateLegalFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'Client Confidentiality',
    status: 'Pass',
    criticality: 'Critical',
    details: 'Client confidentiality measures properly implemented'
  });
  
  findings.push({
    category: 'Client Data Protection',
    status: stats.inProgress > 1 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.inProgress > 1 
      ? 'Client data protection issues detected' 
      : 'Client data protection measures properly implemented'
  });
  
  findings.push({
    category: 'Legal Document Security',
    status: stats.totalEvents < 5 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.totalEvents < 5 
      ? 'Legal document security controls need improvement' 
      : 'Legal document security controls properly maintained'
  });
  
  findings.push({
    category: 'Conflict of Interest Controls',
    status: stats.completedTasks < 3 ? 'Failed' : 'Pass',
    criticality: 'Medium',
    details: stats.completedTasks < 3 
      ? 'Conflict of interest management processes need improvement' 
      : 'Conflict of interest management properly maintained'
  });
  
  return findings;
};
