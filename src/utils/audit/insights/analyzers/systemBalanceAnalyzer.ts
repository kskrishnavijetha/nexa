
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from '../../types';

/**
 * Analyze the balance between system and user actions in the audit events
 */
export const analyzeSystemBalance = (auditEvents: AuditEvent[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Analyze user vs system balance
  const systemPercentage = (auditEvents.filter(e => e.user === 'System').length / auditEvents.length * 100).toFixed(1);
  
  if (parseFloat(systemPercentage) > 70) {
    insights.push({
      text: `${systemPercentage}% of activities are automated system actions, indicating heavy reliance on automated compliance tools with limited human oversight. Consider increasing manual review frequency.`,
      type: 'recommendation'
    });
  } else if (parseFloat(systemPercentage) < 30) {
    insights.push({
      text: `Only ${systemPercentage}% of activities are automated, suggesting a manual-heavy compliance process. Consider implementing more automated compliance checks to improve efficiency and consistency.`,
      type: 'recommendation'
    });
  } else {
    insights.push({
      text: `The balance between automated (${systemPercentage}%) and manual activities demonstrates a well-integrated compliance approach combining technological efficiency with human expertise.`,
      type: 'observation'
    });
  }
  
  return insights;
};
