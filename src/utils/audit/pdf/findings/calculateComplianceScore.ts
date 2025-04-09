
import { ComplianceFinding } from '../../types';

/**
 * Calculate compliance score and determine compliance status based on findings
 * @returns An object containing score and status
 */
export const calculateComplianceScore = (findings: ComplianceFinding[]): { 
  score: number; 
  status: 'Pass' | 'Fail';
  complianceStatus: 'Compliant' | 'Non-Compliant';
} => {
  if (findings.length === 0) return { score: 100, status: 'Pass', complianceStatus: 'Compliant' };
  
  // Count passed findings
  const passedCount = findings.filter(f => f.status === 'Pass').length;
  
  // Calculate score with exact decimal precision
  const score = Number(((passedCount / findings.length) * 100).toFixed(2));
  
  // Use more precise thresholds for determining status
  const status = score >= 80 ? 'Pass' : 'Fail';
  // Add compliance status text for consistent display across application
  const complianceStatus = score >= 80 ? 'Compliant' : 'Non-Compliant';
  
  return { score, status, complianceStatus };
};
