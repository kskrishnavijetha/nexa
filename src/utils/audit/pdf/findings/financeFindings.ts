
import { AuditReportStatistics, ComplianceFinding } from '../../types';

/**
 * Generate findings specific to the finance industry
 */
export const generateFinanceFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'Transaction Monitoring',
    status: 'Pass',
    criticality: 'Critical',
    details: 'Suspicious transaction monitoring in place'
  });
  
  findings.push({
    category: 'PCI DSS Compliance',
    status: stats.inProgress > 3 ? 'Failed' : 'Pass',
    criticality: 'Critical',
    details: stats.inProgress > 3 
      ? 'Cardholder data protection issues detected' 
      : 'Cardholder data properly secured'
  });
  
  findings.push({
    category: 'KYC Verification',
    status: stats.pending > 0 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.pending > 0 
      ? 'Customer verification pending completion' 
      : 'Customer verification fully completed'
  });
  
  findings.push({
    category: 'Financial Data Backup',
    status: 'Pass',
    criticality: 'Medium',
    details: 'Financial records properly backed up'
  });
  
  return findings;
};
