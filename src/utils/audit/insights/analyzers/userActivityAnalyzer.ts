
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from '../../types';

/**
 * Analyze user activity patterns in the audit events
 */
export const analyzeUserActivity = (auditEvents: AuditEvent[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Analyze user activity patterns
  const userActions = new Map<string, number>();
  auditEvents.forEach(event => {
    if (event.user !== 'System') {
      const count = userActions.get(event.user) || 0;
      userActions.set(event.user, count + 1);
    }
  });
  
  // Find most active user
  let mostActiveUser = '';
  let mostActions = 0;
  userActions.forEach((count, user) => {
    if (count > mostActions) {
      mostActiveUser = user;
      mostActions = count;
    }
  });
  
  if (mostActiveUser) {
    insights.push({
      text: `${mostActiveUser} is the most active user with ${mostActions} actions recorded, suggesting a key role in compliance management for this document.`,
      type: 'observation'
    });
  }
  
  return insights;
};
