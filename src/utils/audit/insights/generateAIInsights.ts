
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from '../types';
import { analyzeComplianceChecks } from './analyzers/complianceAnalyzer';
import { analyzeCriticalAssets } from './analyzers/criticalAssetAnalyzer';
import { analyzeActivityFrequency } from './analyzers/frequencyAnalyzer';
import { analyzeRemediationNeeds } from './analyzers/remediationAnalyzer';
import { analyzeSystemBalance } from './analyzers/systemBalanceAnalyzer';
import { analyzeTaskCompletion } from './analyzers/taskCompletionAnalyzer';
import { analyzeActivityOverTime } from './analyzers/timeActivityAnalyzer';
import { analyzeUserActivity } from './analyzers/userActivityAnalyzer';
import { generateFallbackInsights } from './generators/fallbackInsightGenerator';
import { Industry } from '@/utils/types';

/**
 * Generate AI insights from audit events
 */
export const generateAIInsights = (
  auditEvents: AuditEvent[], 
  documentName: string,
  industry?: Industry
): AIInsight[] => {
  if (!auditEvents || auditEvents.length === 0) {
    return generateFallbackInsights();
  }

  // Determine if we have enough data to generate useful insights
  const hasRecentEvents = auditEvents.some(event => {
    const eventDate = new Date(event.timestamp);
    const daysSinceEvent = (Date.now() - eventDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceEvent < 30; // Events within the last 30 days
  });

  if (!hasRecentEvents || auditEvents.length < 3) {
    return generateFallbackInsights();
  }

  // Run analyzers to generate insights
  const insights: AIInsight[] = [
    ...analyzeComplianceChecks(auditEvents),
    ...analyzeTaskCompletion(auditEvents),
    ...analyzeUserActivity(auditEvents),
    ...analyzeActivityOverTime(auditEvents),
    ...analyzeActivityFrequency(auditEvents),
    ...analyzeRemediationNeeds(auditEvents),
    ...analyzeCriticalAssets(auditEvents),
    ...analyzeSystemBalance(auditEvents),
  ];

  // Sort insights by priority (high to low) if they have a priority
  return insights.sort((a, b) => {
    // Default priorities if not specified
    const aPriority = a.priority || 'medium';
    const bPriority = b.priority || 'medium';
    
    const priorityMap: Record<string, number> = {
      'high': 3,
      'medium': 2,
      'low': 1,
    };
    
    return priorityMap[bPriority] - priorityMap[aPriority];
  });
};
