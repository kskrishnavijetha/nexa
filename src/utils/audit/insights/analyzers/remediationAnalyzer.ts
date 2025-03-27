
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from '../../types';

/**
 * Analyze if remediation actions are needed based on the audit events
 */
export const analyzeRemediationNeeds = (auditEvents: AuditEvent[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Look for potential remediation needs
  const remediationNeeded = auditEvents.some(e => 
    e.action.toLowerCase().includes('violation') || 
    e.action.toLowerCase().includes('non-compliance') ||
    e.action.toLowerCase().includes('issue')
  );
  
  if (remediationNeeded) {
    insights.push({
      text: "Compliance issues have been identified in the audit trail. Ensure all identified issues have corresponding remediation actions and verify their completion to maintain regulatory compliance.",
      type: 'warning'
    });
  }
  
  return insights;
};
