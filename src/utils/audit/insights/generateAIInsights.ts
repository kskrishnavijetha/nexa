
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
import { mapToIndustryType } from '../industryUtils';

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
  return mapToIndustryType(documentName);
};

/**
 * Generate industry-specific insights
 */
const generateIndustryInsights = (industry: Industry, auditEvents: AuditEvent[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  switch (industry) {
    case 'Healthcare':
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
      
    case 'Finance & Banking':
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
      
    case 'E-Commerce':
    case 'Retail & Consumer':
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
      
    case 'Cloud & SaaS':
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
      
    case 'Government & Defense':
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
      
    case 'Energy & Utilities':
      insights.push({
        title: 'Critical Infrastructure Protection',
        text: 'NERC CIP compliance gaps identified in operational technology security controls.',
        type: 'warning'
      });
      insights.push({
        title: 'Smart Grid Security',
        text: 'Enhance network segmentation for industrial control systems to prevent lateral movement.',
        type: 'recommendation'
      });
      break;
      
    case 'Telecom':
      insights.push({
        title: 'Customer Data Privacy',
        text: 'CPNI protection measures need enhancement to meet current FCC requirements.',
        type: 'warning'
      });
      insights.push({
        title: 'Network Infrastructure Security',
        text: 'Implement additional security monitoring for critical network infrastructure components.',
        type: 'recommendation'
      });
      break;
      
    case 'Manufacturing & Supply Chain':
      insights.push({
        title: 'ICS Security Controls',
        text: 'Industrial Control System security monitoring needs enhancement to detect advanced threats.',
        type: 'warning'
      });
      insights.push({
        title: 'IoT Device Management',
        text: 'Implement comprehensive IoT device inventory and vulnerability management program.',
        type: 'recommendation'
      });
      break;
      
    case 'Education':
      insights.push({
        title: 'Student Data Privacy',
        text: 'FERPA compliance gaps identified in student record access controls.',
        type: 'warning'
      });
      insights.push({
        title: 'Learning Management Security',
        text: 'Enhance authentication controls for learning management systems to prevent unauthorized access.',
        type: 'recommendation'
      });
      break;
      
    case 'Automotive':
      insights.push({
        title: 'Connected Vehicle Security',
        text: 'Implement stronger security controls for connected vehicle systems.',
        type: 'warning'
      });
      insights.push({
        title: 'Component Traceability',
        text: 'Improve supply chain component traceability and security validation.',
        type: 'recommendation'
      });
      break;
      
    case 'Pharmaceutical & Biotech':
      insights.push({
        title: 'Clinical Data Integrity',
        text: 'Audit trail analysis indicates potential gaps in 21 CFR Part 11 compliance for clinical systems.',
        type: 'warning'
      });
      insights.push({
        title: 'GxP Compliance',
        text: 'Implement enhanced data integrity controls for laboratory information management systems.',
        type: 'recommendation'
      });
      insights.push({
        title: 'Research Data Protection',
        text: 'Strengthen access controls and encryption for sensitive research and development data.',
        type: 'recommendation'
      });
      break;
      
    default:
      // No industry-specific insights needed, use general ones
      break;
  }
  
  return insights;
};
