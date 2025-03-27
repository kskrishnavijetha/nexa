
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from '../../types';

/**
 * Analyze activity frequency in the audit events
 */
export const analyzeActivityFrequency = (auditEvents: AuditEvent[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Add activity frequency analysis
  if (auditEvents.length > 0) {
    const oldestEvent = new Date(auditEvents.reduce((oldest, event) => 
      new Date(event.timestamp) < new Date(oldest.timestamp) ? event : oldest
    ).timestamp);
    
    const newestEvent = new Date(auditEvents.reduce((newest, event) => 
      new Date(event.timestamp) > new Date(newest.timestamp) ? event : newest
    ).timestamp);
    
    const daysDifference = Math.max(1, Math.round((newestEvent.getTime() - oldestEvent.getTime()) / (1000 * 60 * 60 * 24)));
    const eventsPerDay = (auditEvents.length / daysDifference).toFixed(1);
    
    insights.push({
      text: `Average activity frequency is ${eventsPerDay} events per day over the ${daysDifference} day monitoring period, indicating ${parseFloat(eventsPerDay) > 5 ? 'high' : parseFloat(eventsPerDay) > 2 ? 'moderate' : 'low'} engagement with this document.`,
      type: 'observation'
    });
  }
  
  return insights;
};
