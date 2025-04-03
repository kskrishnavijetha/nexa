
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from '../types';
import { analyzeCompliance } from './analyzers/complianceAnalyzer';
import { analyzeCriticalAssets } from './analyzers/criticalAssetAnalyzer';
import { analyzeFrequency } from './analyzers/frequencyAnalyzer';
import { analyzeRemediation } from './analyzers/remediationAnalyzer';
import { analyzeSystemBalance } from './analyzers/systemBalanceAnalyzer';
import { analyzeTaskCompletion } from './analyzers/taskCompletionAnalyzer';
import { analyzeTimeActivity } from './analyzers/timeActivityAnalyzer';
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
    return generateFallbackInsights(documentName, industry);
  }

  // Determine if we have enough data to generate useful insights
  const hasRecentEvents = auditEvents.some(event => {
    const eventDate = new Date(event.timestamp);
    const daysSinceEvent = (Date.now() - eventDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceEvent < 30; // Events within the last 30 days
  });

  if (!hasRecentEvents || auditEvents.length < 3) {
    return generateFallbackInsights(documentName, industry);
  }

  // Run analyzers to generate insights
  const insights: AIInsight[] = [
    ...analyzeCompliance(auditEvents, industry),
    ...analyzeTaskCompletion(auditEvents),
    ...analyzeUserActivity(auditEvents),
    ...analyzeTimeActivity(auditEvents),
    ...analyzeFrequency(auditEvents),
    ...analyzeRemediation(auditEvents),
    ...analyzeCriticalAssets(auditEvents),
    ...analyzeSystemBalance(auditEvents),
  ];

  // Sort insights by priority (high to low)
  return insights.sort((a, b) => {
    const priorityMap: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };
    return priorityMap[b.priority] - priorityMap[a.priority];
  });
};
