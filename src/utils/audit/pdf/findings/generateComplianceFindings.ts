
import { AuditReportStatistics, ComplianceFinding } from '../../types';
import { Industry } from '@/utils/types';

/**
 * Generate compliance findings based on audit statistics and industry
 */
export const generateComplianceFindings = (
  stats: AuditReportStatistics,
  documentName?: string
): ComplianceFinding[] => {
  // Extract industry from document name if available
  const industry = extractIndustryFromDocument(documentName);
  
  // Generate industry-specific findings
  if (industry) {
    return generateIndustryFindings(stats, industry);
  }
  
  // Default findings when no industry is identified
  return generateDefaultFindings(stats);
};

/**
 * Extract the industry from document name
 */
const extractIndustryFromDocument = (documentName?: string): Industry | undefined => {
  if (!documentName) return undefined;
  
  const lowerName = documentName.toLowerCase();
  
  // Check for industry keywords in the document name
  if (lowerName.includes('health') || lowerName.includes('medical') || lowerName.includes('hospital')) {
    return 'healthcare';
  }
  if (lowerName.includes('bank') || lowerName.includes('finance') || lowerName.includes('payment')) {
    return 'finance';
  }
  if (lowerName.includes('retail') || lowerName.includes('ecommerce') || lowerName.includes('shop')) {
    return 'retail';
  }
  if (lowerName.includes('tech') || lowerName.includes('software') || lowerName.includes('cloud')) {
    return 'technology';
  }
  if (lowerName.includes('gov') || lowerName.includes('public')) {
    return 'government';
  }
  
  return undefined;
};

/**
 * Generate default findings when no industry is identified
 */
const generateDefaultFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
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

/**
 * Generate findings specific to the healthcare industry
 */
const generateHealthcareFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
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

/**
 * Generate findings specific to the finance industry
 */
const generateFinanceFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
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

/**
 * Generate findings specific to the retail industry
 */
const generateRetailFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
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

/**
 * Generate findings specific to the technology industry
 */
const generateTechnologyFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
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

/**
 * Generate findings specific to the government industry
 */
const generateGovernmentFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  findings.push({
    category: 'Records Management',
    status: stats.completed < stats.totalEvents * 0.7 ? 'Failed' : 'Pass',
    criticality: 'High',
    details: stats.completed < stats.totalEvents * 0.7 
      ? 'Records retention issues detected' 
      : 'Records properly managed and retained'
  });
  
  findings.push({
    category: 'Access Authorization',
    status: 'Pass',
    criticality: 'Critical',
    details: 'Proper authorization controls in place'
  });
  
  findings.push({
    category: 'FISMA Compliance',
    status: stats.pending > 0 ? 'Failed' : 'Pass',
    criticality: 'Critical',
    details: stats.pending > 0 
      ? 'Federal information security issues detected' 
      : 'Federal information security measures in place'
  });
  
  findings.push({
    category: 'Separation of Duties',
    status: 'Pass',
    criticality: 'Medium',
    details: 'Proper segregation of duties enforced'
  });
  
  return findings;
};

/**
 * Generate industry-specific findings
 */
const generateIndustryFindings = (stats: AuditReportStatistics, industry: Industry): ComplianceFinding[] => {
  switch (industry) {
    case 'healthcare':
      return generateHealthcareFindings(stats);
    case 'finance':
      return generateFinanceFindings(stats);
    case 'retail':
      return generateRetailFindings(stats);
    case 'technology':
      return generateTechnologyFindings(stats);
    case 'government':
      return generateGovernmentFindings(stats);
    default:
      return generateDefaultFindings(stats);
  }
};
