
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
  const score = Math.round((passedCount / findings.length) * 100);
  
  // Determine status based on score
  const status = score >= 80 ? 'Pass' : 'Fail';
  // Add compliance status text for consistent display across application
  const complianceStatus = score >= 80 ? 'Compliant' : 'Non-Compliant';
  
  return { score, status, complianceStatus };
};
