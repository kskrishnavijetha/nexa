
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
      insights.push({
        title: 'HITECH Act Compliance',
        text: 'Consider enhanced breach notification procedures to comply with HITECH requirements.',
        type: 'recommendation'
      });
      insights.push({
        title: '21 CFR Part 11 Compliance',
        text: 'Electronic records and signatures should be validated against FDA requirements.',
        type: 'warning'
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
      insights.push({
        title: 'SOX Compliance',
        text: 'Financial reporting controls should be reviewed for Sarbanes-Oxley Act compliance.',
        type: 'recommendation'
      });
      insights.push({
        title: 'GLBA Privacy Notices',
        text: 'Update customer privacy notices to comply with Gramm-Leach-Bliley Act requirements.',
        type: 'warning'
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
      insights.push({
        title: 'CCPA Compliance',
        text: 'Implement "Do Not Sell My Personal Information" functionality to comply with California regulations.',
        type: 'recommendation'
      });
      insights.push({
        title: 'FTC Act Compliance',
        text: 'Review advertising practices and disclosures for compliance with consumer protection laws.',
        type: 'recommendation'
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
      insights.push({
        title: 'SOC 2 Service Controls',
        text: 'Enhance monitoring and logging of service availability to meet SOC 2 requirements.',
        type: 'recommendation'
      });
      insights.push({
        title: 'FedRAMP Compliance',
        text: 'Government data handling practices need additional controls to meet federal requirements.',
        type: 'warning'
      });
      insights.push({
        title: 'CIS Benchmark Alignment',
        text: 'System configurations should be assessed against CIS benchmarks for cloud security.',
        type: 'recommendation'
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
      insights.push({
        title: 'ITAR Compliance',
        text: 'Technical data export controls need enhancement to prevent unauthorized access.',
        type: 'warning'
      });
      insights.push({
        title: 'CMMC Preparation',
        text: 'Prepare for Cybersecurity Maturity Model Certification assessment through enhanced controls.',
        type: 'recommendation'
      });
      insights.push({
        title: 'FISMA Controls',
        text: 'Federal information system security controls should be regularly assessed and documented.',
        type: 'recommendation'
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
      insights.push({
        title: 'FERC Compliance',
        text: 'Regulatory reporting for energy market participation should be reviewed for accuracy.',
        type: 'recommendation'
      });
      insights.push({
        title: 'Environmental Management',
        text: 'ISO 14001 environmental impact monitoring should be integrated with compliance processes.',
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
      insights.push({
        title: 'FCC Regulations Compliance',
        text: 'Telecommunications service reporting should be reviewed for regulatory completeness.',
        type: 'recommendation'
      });
      insights.push({
        title: 'CPRA Implementation',
        text: 'Prepare for expanded consumer privacy rights under California Privacy Rights Act.',
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
      insights.push({
        title: 'Quality Management',
        text: 'ISO 9001 process documentation should be aligned with compliance management systems.',
        type: 'recommendation'
      });
      insights.push({
        title: 'Supply Chain Security',
        text: 'C-TPAT security practices should be extended to all international suppliers.',
        type: 'recommendation'
      });
      insights.push({
        title: 'RoHS Compliance',
        text: 'Material compliance documentation for hazardous substances should be centralized.',
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
      insights.push({
        title: 'Child Online Protection',
        text: 'COPPA compliance requires enhanced consent management for users under 13.',
        type: 'warning'
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
      insights.push({
        title: 'Functional Safety',
        text: 'ISO 26262 functional safety documentation should be integrated with compliance processes.',
        type: 'recommendation'
      });
      insights.push({
        title: 'Quality Management',
        text: 'TS 16949 automotive quality management practices should be digitally transformed.',
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
      insights.push({
        title: 'FDA Regulatory Compliance',
        text: 'Drug and medical device compliance documentation should be centralized for audit readiness.',
        type: 'recommendation'
      });
      insights.push({
        title: 'EMA Submission Standards',
        text: 'European Medicines Agency submission formatting should follow current standards.',
        type: 'recommendation'
      });
      insights.push({
        title: 'Quality Management System',
        text: 'ISO 13485 medical device quality management procedures require digital transformation.',
        type: 'recommendation'
      });
      break;
      
    default:
      // No industry-specific insights needed, use general ones
      break;
  }
  
  return insights;
};
