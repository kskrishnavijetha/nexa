
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the Automotive industry
 */
export const generateAutomotiveFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'Functional Safety',
    status: 'Pass',
    criticality: 'Critical',
    details: 'ISO 26262 functional safety requirements met'
  });
  
  findings.push({
    category: 'Vehicle Data Protection',
    status: stats.inProgress > 2 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.inProgress > 2 
      ? 'Vehicle data protection issues detected' 
      : 'Vehicle data properly protected'
  });
  
  findings.push({
    category: 'Software Update Processes',
    status: stats.totalEvents < 5 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.totalEvents < 5 
      ? 'Insufficient OTA update security' 
      : 'Software update processes properly secured'
  });
  
  findings.push({
    category: 'Component Traceability',
    status: stats.completedTasks! < 4 ? 'Failed' : 'Pass',
    criticality: 'Medium',
    details: stats.completedTasks! < 4 
      ? 'Supply chain component traceability insufficient' 
      : 'Supply chain component traceability maintained'
  });
  
  return findings;
};
