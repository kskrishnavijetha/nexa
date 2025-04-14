
import { AuditEvent } from '@/components/audit/types';
import { ComplianceRisk } from '@/utils/types';

/**
 * Calculate risk distribution from audit events
 */
export const calculateRiskDistribution = (auditEvents: AuditEvent[]) => {
  // Initialize counters
  const distribution = {
    high: 0,
    medium: 0,
    low: 0,
    total: auditEvents.length
  };
  
  // In a real implementation, this would analyze actual risks from events
  // For demo purposes, we'll generate a distribution based on the event count
  distribution.high = Math.round(distribution.total * 0.15);
  distribution.medium = Math.round(distribution.total * 0.35);
  distribution.low = distribution.total - distribution.high - distribution.medium;
  
  return distribution;
};

/**
 * Calculate compliance score based on risks
 */
export const calculateComplianceScore = (risks: ComplianceRisk[]) => {
  if (!risks || risks.length === 0) return 100;
  
  // Count risks by severity
  const counts = {
    high: 0,
    medium: 0,
    low: 0
  };
  
  risks.forEach(risk => {
    if (risk.severity in counts) {
      counts[risk.severity as keyof typeof counts]++;
    }
  });
  
  // Calculate score - high risks have more impact
  const impact = (counts.high * 5) + (counts.medium * 2) + (counts.low * 0.5);
  const maxScore = 100;
  const score = Math.max(0, Math.min(maxScore - impact, maxScore));
  
  return Math.round(score);
};

/**
 * Generate a visual representation of compliance scores for different regulations
 */
export const generateComplianceVisualization = (auditEvents: AuditEvent[], industry?: string) => {
  // In a real implementation, this would analyze actual events
  // For demo, we'll generate mock data based on event count and industry
  
  // Base compliance score depends on event count
  const baseScore = Math.max(70, 100 - (auditEvents.length * 0.5));
  
  // Generate scores for common regulations
  const scores: Record<string, number> = {
    'GDPR': Math.round(baseScore + (Math.random() * 15 - 7)),
    'HIPAA': Math.round(baseScore + (Math.random() * 15 - 7)),
    'SOC 2': Math.round(baseScore + (Math.random() * 15 - 7)),
    'PCI-DSS': Math.round(baseScore + (Math.random() * 15 - 7))
  };
  
  // Add industry-specific regulations
  if (industry) {
    switch (industry) {
      case 'Healthcare':
        scores['HITECH'] = Math.round(baseScore + (Math.random() * 15));
        break;
      case 'Finance':
        scores['GLBA'] = Math.round(baseScore + (Math.random() * 15));
        scores['SOX'] = Math.round(baseScore + (Math.random() * 15));
        break;
      case 'Retail':
        scores['CCPA'] = Math.round(baseScore + (Math.random() * 15));
        break;
    }
  }
  
  // Ensure all scores are within valid range
  Object.keys(scores).forEach(key => {
    scores[key] = Math.max(0, Math.min(scores[key], 100));
  });
  
  return scores;
};
