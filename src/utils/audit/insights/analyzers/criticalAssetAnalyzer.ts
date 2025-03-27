
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from '../../types';

/**
 * Analyze if the document is a critical compliance asset
 */
export const analyzeCriticalAssets = (auditEvents: AuditEvent[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Add recommendations based on patterns
  if (auditEvents.length > 10) {
    insights.push({
      text: `This document has significant activity with ${auditEvents.length} tracked events, suggesting it may be a critical compliance asset requiring continued monitoring and periodic reviews.`,
      type: 'observation'
    });
  }
  
  return insights;
};
