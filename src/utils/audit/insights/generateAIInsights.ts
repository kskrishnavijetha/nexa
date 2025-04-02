
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
import { Industry } from '@/utils/types';

/**
 * Generate AI-enhanced insights from audit events with more detailed analysis
 */
export const generateAIInsights = (
  auditEvents: AuditEvent[],
  documentName?: string
): AIInsight[] => {
  // Extract industry from document name if possible
  const industry = extractIndustryFromDocument(documentName);
  
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
  
  // Add industry-specific insights if industry was detected
  if (industry) {
    insights.push(...generateIndustryInsights(industry, auditEvents));
  }
  
  // Return at least some insights even if our analysis didn't find patterns
  if (insights.length === 0) {
    insights.push(...generateFallbackInsights());
  }
  
  return insights;
};

/**
 * Extract the industry from document name
 */
const extractIndustryFromDocument = (documentName?: string): Industry | undefined => {
  if (!documentName) return undefined;
  
  const lowerName = documentName.toLowerCase();
  
  // Check for industry keywords in the document name
  if (lowerName.includes('health') || lowerName.includes('medical') || lowerName.includes('hospital')) {
    return 'healthcare';
  }
  if (lowerName.includes('bank') || lowerName.includes('finance') || lowerName.includes('payment')) {
    return 'finance';
  }
  if (lowerName.includes('retail') || lowerName.includes('ecommerce') || lowerName.includes('shop')) {
    return 'retail';
  }
  if (lowerName.includes('tech') || lowerName.includes('software') || lowerName.includes('cloud')) {
    return 'technology';
  }
  if (lowerName.includes('gov') || lowerName.includes('public')) {
    return 'government';
  }
  
  return undefined;
};

/**
 * Generate industry-specific insights
 */
const generateIndustryInsights = (industry: Industry, auditEvents: AuditEvent[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  switch (industry) {
    case 'healthcare':
      insights.push({
        title: 'HIPAA Compliance Insight',
        text: 'Patient data access patterns suggest potential privacy control improvements needed.',
        type: 'warning'
      });
      insights.push({
        title: 'Medical Record Security',
        text: 'Implement additional safeguards for electronic protected health information (ePHI).',
        type: 'recommendation'
      });
      break;
      
    case 'finance':
      insights.push({
        title: 'Financial Transaction Monitoring',
        text: 'Suspicious transaction pattern detection should be enhanced for better fraud prevention.',
        type: 'warning'
      });
      insights.push({
        title: 'PCI DSS Compliance',
        text: 'Strengthen cardholder data environment (CDE) segmentation to improve security posture.',
        type: 'recommendation'
      });
      break;
      
    case 'retail':
      insights.push({
        title: 'Customer Data Protection',
        text: 'Consider implementing enhanced customer PII protection measures for loyalty program data.',
        type: 'recommendation'
      });
      insights.push({
        title: 'Inventory Tracking',
        text: 'Audit trail for inventory changes shows potential gaps in logging completeness.',
        type: 'warning'
      });
      break;
      
    case 'technology':
      insights.push({
        title: 'API Access Controls',
        text: 'Implement stricter rate limiting and authentication for API endpoints to prevent abuse.',
        type: 'recommendation'
      });
      insights.push({
        title: 'Development Environment',
        text: 'Code deployment patterns indicate potential bypassing of security review processes.',
        type: 'warning'
      });
      break;
      
    case 'government':
      insights.push({
        title: 'Records Management',
        text: 'Implement NARA-compliant records retention schedules for all document categories.',
        type: 'recommendation'
      });
      insights.push({
        title: 'Classified Information Handling',
        text: 'Access controls for sensitive information should be reviewed for proper clearance enforcement.',
        type: 'warning'
      });
      break;
      
    default:
      // No industry-specific insights needed, use general ones
      break;
  }
  
  return insights;
};
