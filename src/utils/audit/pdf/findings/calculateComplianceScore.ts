
import { ComplianceFinding } from '../../types';

/**
 * Calculate compliance score based on findings
 */
export const calculateComplianceScore = (findings: ComplianceFinding[]): number => {
  if (findings.length === 0) return 100;
  
  // Count passed findings
  const passedCount = findings.filter(f => f.status === 'Pass').length;
  return Math.round((passedCount / findings.length) * 100);
};
