
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from '../types';
import { analyzeUserActivity } from './analyzers/userActivityAnalyzer';
import { analyzeTaskCompletion } from './analyzers/taskCompletionAnalyzer';
import { analyzeActivityOverTime } from './analyzers/timeActivityAnalyzer';
import { analyzeComplianceChecks } from './analyzers/complianceAnalyzer';
import { analyzeSystemBalance } from './analyzers/systemBalanceAnalyzer';
import { analyzeActivityFrequency } from './analyzers/frequencyAnalyzer';
import { analyzeCriticalAssets } from './analyzers/criticalAssetAnalyzer';
import { analyzeRemediationNeeds } from './analyzers/remediationAnalyzer';
import { generateFallbackInsights } from './generators/fallbackInsightGenerator';

/**
 * Generate AI-enhanced insights from audit events with more detailed analysis
 */
export const generateAIInsights = (auditEvents: AuditEvent[]): AIInsight[] => {
  // In a real application, this would call an AI model API
  // For now, we'll generate insights based on patterns in the audit data
  
  const insights: AIInsight[] = [];
  
  // Run all analyzers to generate insights
  insights.push(...analyzeUserActivity(auditEvents));
  insights.push(...analyzeTaskCompletion(auditEvents));
  insights.push(...analyzeActivityOverTime(auditEvents));
  insights.push(...analyzeComplianceChecks(auditEvents));
  insights.push(...analyzeSystemBalance(auditEvents));
  insights.push(...analyzeActivityFrequency(auditEvents));
  insights.push(...analyzeCriticalAssets(auditEvents));
  insights.push(...analyzeRemediationNeeds(auditEvents));
  
  // Return at least some insights even if our analysis didn't find patterns
  if (insights.length === 0) {
    insights.push(...generateFallbackInsights());
  }
  
  return insights;
};
