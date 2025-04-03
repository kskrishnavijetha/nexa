
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from '../../types';
import { Industry } from '@/utils/types';

/**
 * Analyze compliance check distribution in the audit events
 */
export const analyzeComplianceChecks = (auditEvents: AuditEvent[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Analyze compliance check distribution
  const complianceChecks = auditEvents.filter(e => 
    e.action.toLowerCase().includes('compliance') || 
    e.action.toLowerCase().includes('check') ||
    e.action.toLowerCase().includes('scan')
  ).length;
  
  if (complianceChecks > 0) {
    const checkPercentage = (complianceChecks / auditEvents.length * 100).toFixed(1);
    insights.push({
      text: `${complianceChecks} compliance verification activities (${checkPercentage}% of all events) have been performed, demonstrating ${parseFloat(checkPercentage) > 30 ? 'thorough' : 'basic'} due diligence in regulatory adherence.`,
      type: 'observation',
      priority: 'medium'
    });
  }
  
  return insights;
};

// For compatibility with previous code
export const analyzeCompliance = analyzeComplianceChecks;
