
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from '../../types';

/**
 * Analyze activity patterns over time in the audit events
 */
export const analyzeActivityOverTime = (auditEvents: AuditEvent[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Analyze activity over time
  const activityByDay = new Map<string, number>();
  auditEvents.forEach(event => {
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    const count = activityByDay.get(date) || 0;
    activityByDay.set(date, count + 1);
  });
  
  // Find most active day
  let mostActiveDay = '';
  let mostDayActions = 0;
  activityByDay.forEach((count, day) => {
    if (count > mostDayActions) {
      mostActiveDay = day;
      mostDayActions = count;
    }
  });
  
  if (mostActiveDay) {
    insights.push({
      text: `Highest activity was recorded on ${new Date(mostActiveDay).toLocaleDateString()} with ${mostDayActions} events, which may correlate with compliance deadlines or review cycles.`,
      type: 'observation'
    });
  }
  
  return insights;
};
