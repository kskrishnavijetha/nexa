
import { ComplianceFinding } from '../../types';

/**
 * Calculate compliance score and determine compliance status based on findings
 * @returns An object containing score and status
 */
export const calculateComplianceScore = (findings: ComplianceFinding[]): { 
  score: number; 
  status: 'Pass' | 'Fail' 
} => {
  if (findings.length === 0) return { score: 100, status: 'Pass' };
  
  // Count passed findings
  const passedCount = findings.filter(f => f.status === 'Pass').length;
  const score = Math.round((passedCount / findings.length) * 100);
  
  // Determine status based on score
  const status = score >= 80 ? 'Pass' : 'Fail';
  
  return { score, status };
};
